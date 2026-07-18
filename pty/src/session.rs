use crate::protocol::{CellJson, Event};
use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::collections::HashMap;
use std::io::{self, Read, Write};
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::{Arc, Condvar, Mutex};
use std::thread;
use wezterm_surface::CursorVisibility;
use wezterm_term::color::{ColorAttribute, ColorPalette};
use wezterm_term::{
    Intensity, MouseEncoding, Terminal, TerminalConfiguration, TerminalSize, Underline,
};

/// Write adapter that shares the PTY writer with Terminal for DSR responses
struct PtyResponseWriter(Arc<Mutex<Box<dyn Write + Send>>>);

impl Write for PtyResponseWriter {
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.0.lock().unwrap().write(buf)
    }
    fn flush(&mut self) -> io::Result<()> {
        self.0.lock().unwrap().flush()
    }
}

#[derive(Debug)]
struct HelixboxTermConfig;

impl TerminalConfiguration for HelixboxTermConfig {
    fn scrollback_size(&self) -> usize {
        1000
    }

    fn color_palette(&self) -> ColorPalette {
        ColorPalette::default()
    }
}

pub struct TerminalSession {
    id: String,
    terminal: Arc<Mutex<Terminal>>,
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
    master: Box<dyn portable_pty::MasterPty + Send>,
    pub dirty: Arc<AtomicBool>,
    pub exited: Arc<AtomicBool>,
    exit_code: Arc<Mutex<Option<i32>>>,
    child: Arc<Mutex<Box<dyn portable_pty::Child + Send + Sync>>>,
    _reader_handle: thread::JoinHandle<()>,
    prev_cells: Mutex<Vec<Vec<CellJson>>>,
    prev_title: Mutex<String>,
    scroll_offset: Arc<AtomicUsize>,
}

fn color_to_string(c: ColorAttribute) -> String {
    match c {
        ColorAttribute::Default => "default".to_string(),
        ColorAttribute::PaletteIndex(n) if n < 16 => n.to_string(),
        ColorAttribute::PaletteIndex(n) => {
            let (r, g, b) = idx_to_rgb(n);
            format!("#{:02x}{:02x}{:02x}", r, g, b)
        }
        ColorAttribute::TrueColorWithPaletteFallback(color, _) => {
            let (r, g, b, _) = color.to_srgb_u8();
            format!("#{:02x}{:02x}{:02x}", r, g, b)
        }
        ColorAttribute::TrueColorWithDefaultFallback(color) => {
            let (r, g, b, _) = color.to_srgb_u8();
            format!("#{:02x}{:02x}{:02x}", r, g, b)
        }
    }
}

fn idx_to_rgb(idx: u8) -> (u8, u8, u8) {
    if idx < 16 {
        return (0, 0, 0);
    }
    if idx < 232 {
        let i = idx - 16;
        let b = i % 6;
        let g = (i / 6) % 6;
        let r = i / 36;
        let v = |c: u8| if c == 0 { 0u8 } else { 55 + 40 * c };
        (v(r), v(g), v(b))
    } else {
        let v = 8 + 10 * (idx - 232);
        (v, v, v)
    }
}

fn cell_to_json(cell: Option<&wezterm_term::Cell>) -> CellJson {
    match cell {
        Some(cell) => {
            let a = cell.attrs();
            let (mut fg, mut bg) = (a.foreground(), a.background());
            if a.reverse() {
                std::mem::swap(&mut fg, &mut bg);
            }
            let mut attrs: u8 = 0;
            if a.intensity() == Intensity::Bold {
                attrs |= 1;
            }
            if a.intensity() == Intensity::Half {
                attrs |= 2;
            }
            if a.italic() {
                attrs |= 4;
            }
            if a.underline() != Underline::None {
                attrs |= 8;
            }
            let text = cell.str();
            CellJson {
                char: if cell.width() == 0 {
                    String::new()
                } else if text == " " || text.is_empty() {
                    " ".to_string()
                } else {
                    text.to_string()
                },
                fg: color_to_string(fg),
                bg: color_to_string(bg),
                attrs,
            }
        }
        None => CellJson {
            char: " ".to_string(),
            fg: "default".to_string(),
            bg: "default".to_string(),
            attrs: 0,
        },
    }
}

impl TerminalSession {
    pub fn spawn(
        id: String,
        shell: &str,
        cols: u16,
        rows: u16,
        render_notify: Arc<(Mutex<bool>, Condvar)>,
    ) -> Result<Self, String> {
        let pty_system = native_pty_system();

        let pair = pty_system
            .openpty(PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(|e| format!("Failed to open PTY: {}", e))?;

        let mut cmd = CommandBuilder::new(shell);
        cmd.cwd(std::env::current_dir().unwrap_or_else(|_| std::path::PathBuf::from("/")));
        cmd.env("TERM", "xterm-256color");
        cmd.env("COLORTERM", "truecolor");

        let child = pair
            .slave
            .spawn_command(cmd)
            .map_err(|e| format!("Failed to spawn command: {}", e))?;

        drop(pair.slave);

        let reader = pair
            .master
            .try_clone_reader()
            .map_err(|e| format!("Failed to clone reader: {}", e))?;
        let pty_writer = pair
            .master
            .take_writer()
            .map_err(|e| format!("Failed to take writer: {}", e))?;

        let writer_arc: Arc<Mutex<Box<dyn Write + Send>>> =
            Arc::new(Mutex::new(pty_writer));

        let terminal = Arc::new(Mutex::new(Terminal::new(
            TerminalSize {
                rows: rows as usize,
                cols: cols as usize,
                pixel_width: 0,
                pixel_height: 0,
                dpi: 0,
            },
            Arc::new(HelixboxTermConfig),
            "helixbox-pty",
            "0.1.0",
            Box::new(PtyResponseWriter(Arc::clone(&writer_arc))),
        )));
        let dirty = Arc::new(AtomicBool::new(false));
        let exited = Arc::new(AtomicBool::new(false));
        let exit_code: Arc<Mutex<Option<i32>>> = Arc::new(Mutex::new(None));
        let child_arc = Arc::new(Mutex::new(child));

        let terminal_clone = Arc::clone(&terminal);
        let dirty_clone = Arc::clone(&dirty);
        let exited_clone = Arc::clone(&exited);
        let exit_code_clone = Arc::clone(&exit_code);
        let child_clone = Arc::clone(&child_arc);
        let notify_clone = Arc::clone(&render_notify);

        let reader_handle = thread::spawn(move || {
            let mut reader = reader;
            let mut buf = [0u8; 65536];

            loop {
                match reader.read(&mut buf) {
                    Ok(0) | Err(_) => {
                        let code = child_clone
                            .lock()
                            .ok()
                            .and_then(|mut c| c.try_wait().ok().flatten())
                            .map(|s| if s.success() { 0 } else { s.exit_code() as i32 })
                            .unwrap_or(-1);
                        *exit_code_clone.lock().unwrap() = Some(code);
                        exited_clone.store(true, Ordering::Relaxed);
                        dirty_clone.store(true, Ordering::Relaxed);
                        let (lock, cvar) = &*notify_clone;
                        *lock.lock().unwrap() = true;
                        cvar.notify_one();
                        break;
                    }
                    Ok(n) => {
                        terminal_clone.lock().unwrap().advance_bytes(&buf[..n]);
                        dirty_clone.store(true, Ordering::Relaxed);
                        if n < buf.len() {
                            let (lock, cvar) = &*notify_clone;
                            *lock.lock().unwrap() = true;
                            cvar.notify_one();
                        }
                    }
                }
            }
        });

        Ok(TerminalSession {
            id,
            terminal,
            writer: writer_arc,
            master: pair.master,
            dirty,
            exited,
            exit_code,
            child: child_arc,
            _reader_handle: reader_handle,
            prev_cells: Mutex::new(Vec::new()),
            prev_title: Mutex::new(String::new()),
            scroll_offset: Arc::new(AtomicUsize::new(0)),
        })
    }

    pub fn write(&self, data: &str) -> Result<(), String> {
        let mut writer = self.writer.lock().unwrap();
        writer
            .write_all(data.as_bytes())
            .map_err(|e| format!("Write failed: {}", e))?;
        writer.flush().map_err(|e| format!("Flush failed: {}", e))
    }

    pub fn resize(&self, cols: u16, rows: u16) -> Result<(), String> {
        self.master
            .resize(PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(|e| format!("PTY resize failed: {}", e))?;
        self.terminal.lock().unwrap().resize(TerminalSize {
            rows: rows as usize,
            cols: cols as usize,
            pixel_width: 0,
            pixel_height: 0,
            dpi: 0,
        });
        // Clear prev_cells so next snapshot sends a full frame.
        // The JS side recreates its buffer from scratch on resize,
        // so we must send all rows, not just diffs.
        self.prev_cells.lock().unwrap().clear();
        self.dirty.store(true, Ordering::Relaxed);
        Ok(())
    }

    pub fn kill(&self) -> Result<(), String> {
        self.child
            .lock()
            .unwrap()
            .kill()
            .map_err(|e| format!("Kill failed: {}", e))
    }

    pub fn set_scroll_offset(&self, offset: usize) {
        self.scroll_offset.store(offset, Ordering::Relaxed);
        self.dirty.store(true, Ordering::Relaxed);
    }

    pub fn snapshot(&self) -> Event {
        let mut terminal = self.terminal.lock().unwrap();
        let offset = self.scroll_offset.load(Ordering::Relaxed);

        // Title: detect changes by comparing with previous
        let current_title = terminal.get_title().to_string();
        let title = {
            let mut prev = self.prev_title.lock().unwrap();
            if current_title != *prev {
                *prev = current_title.clone();
                if current_title.is_empty() {
                    None
                } else {
                    Some(current_title)
                }
            } else {
                None
            }
        };

        let size = terminal.get_size();
        let (vis_rows, cols) = (size.rows, size.cols);
        let cursor = terminal.cursor_pos();
        let cursor_visible =
            cursor.visibility != CursorVisibility::Hidden;
        let app_cursor = terminal.application_cursor_keys();
        let bracketed = terminal.bracketed_paste_enabled();
        let in_alt = terminal.is_alt_screen_active();
        let reverse_video = terminal.get_reverse_video();

        // Mouse mode
        let mouse_mode: u16 = if terminal.any_event_mouse() {
            1003
        } else if terminal.button_event_mouse() {
            1002
        } else if terminal.mouse_tracking() {
            1000
        } else {
            0
        };
        let mouse_encoding: u16 = match terminal.get_mouse_encoding() {
            MouseEncoding::X10 => 0,
            MouseEncoding::Utf8 => 1005,
            MouseEncoding::SGR | MouseEncoding::SgrPixels => 1006,
        };

        // Scrollback length: total lines - visible rows
        let screen = terminal.screen_mut();
        let total_lines = screen.scrollback_rows();
        let scrollback_length = if !in_alt {
            total_lines.saturating_sub(vis_rows)
        } else {
            0
        };

        // Read visible screen cells with dirty tracking
        let mut prev = self.prev_cells.lock().unwrap();
        let mut cells_map = HashMap::new();

        // When scrolled, clear prev_cells to force full frame
        if offset > 0 {
            prev.clear();
        }

        // Base physical index: where the visible viewport starts in the line deque
        // total_lines = scrollback + visible, so viewport starts at total_lines - vis_rows
        let viewport_start = total_lines.saturating_sub(vis_rows);
        let clamped_offset = if offset > 0 && !in_alt {
            offset.min(scrollback_length)
        } else {
            0
        };

        for row in 0..vis_rows {
            let mut row_cells = Vec::with_capacity(cols);

            // Physical row: viewport_start - scroll_offset + row
            let phys_row = viewport_start.saturating_sub(clamped_offset) + row;

            if phys_row < total_lines {
                let line = screen.line_mut(phys_row);
                let cells = line.cells_mut();
                for col in 0..cols {
                    row_cells.push(cell_to_json(cells.get(col)));
                }
            } else {
                for _ in 0..cols {
                    row_cells.push(CellJson {
                        char: " ".to_string(),
                        fg: "default".to_string(),
                        bg: "default".to_string(),
                        attrs: 0,
                    });
                }
            }

            let changed = row >= prev.len() || prev[row] != row_cells;
            if changed {
                if row >= prev.len() {
                    prev.resize(row + 1, Vec::new());
                }
                prev[row] = row_cells.clone();
                cells_map.insert(row.to_string(), row_cells);
            }
        }
        prev.truncate(vis_rows);

        Event::State {
            id: self.id.clone(),
            cells: cells_map,
            cursor_x: cursor.x,
            cursor_y: cursor.y as usize,
            cols,
            rows: vis_rows,
            cursor_visible: if offset > 0 { false } else { cursor_visible },
            cursor_style: 0,
            app_cursor_keys: app_cursor,
            bracketed_paste: bracketed,
            mouse_mode,
            mouse_encoding,
            reverse_video,
            title,
            scrollback_length,
        }
    }

    pub fn exit_code(&self) -> Option<i32> {
        *self.exit_code.lock().unwrap()
    }
}
