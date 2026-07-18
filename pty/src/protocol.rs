use serde::{Deserialize, Serialize};
use std::collections::HashMap;

fn is_zero(v: &u8) -> bool {
    *v == 0
}
fn is_false(v: &bool) -> bool {
    !*v
}
fn is_zero_u16(v: &u16) -> bool {
    *v == 0
}
#[derive(Deserialize)]
#[serde(tag = "cmd")]
pub enum Command {
    #[serde(rename = "spawn")]
    Spawn {
        id: String,
        shell: Option<String>,
        cols: u16,
        rows: u16,
    },
    #[serde(rename = "write")]
    Write { id: String, data: String },
    #[serde(rename = "resize")]
    Resize { id: String, cols: u16, rows: u16 },
    #[serde(rename = "kill")]
    Kill { id: String },
    #[serde(rename = "scroll")]
    Scroll { id: String, offset: usize },
}

#[derive(Serialize)]
#[serde(tag = "event")]
pub enum Event {
    #[serde(rename = "spawned")]
    Spawned { id: String },
    #[serde(rename = "state")]
    State {
        id: String,
        cells: HashMap<String, Vec<CellJson>>,
        #[serde(rename = "cursorX")]
        cursor_x: usize,
        #[serde(rename = "cursorY")]
        cursor_y: usize,
        cols: usize,
        rows: usize,
        #[serde(rename = "cursorVisible")]
        cursor_visible: bool,
        #[serde(rename = "cursorStyle", skip_serializing_if = "is_zero")]
        cursor_style: u8,
        #[serde(rename = "appCursorKeys", skip_serializing_if = "is_false")]
        app_cursor_keys: bool,
        #[serde(rename = "bracketedPaste", skip_serializing_if = "is_false")]
        bracketed_paste: bool,
        #[serde(rename = "mouseMode", skip_serializing_if = "is_zero_u16")]
        mouse_mode: u16,
        #[serde(rename = "mouseEncoding", skip_serializing_if = "is_zero_u16")]
        mouse_encoding: u16,
        #[serde(rename = "reverseVideo", skip_serializing_if = "is_false")]
        reverse_video: bool,
        #[serde(skip_serializing_if = "Option::is_none")]
        title: Option<String>,
        #[serde(rename = "scrollbackLength")]
        scrollback_length: usize,
    },
    #[serde(rename = "exit")]
    Exit { id: String, code: i32 },
    #[serde(rename = "error")]
    Error { id: String, message: String },
}

#[derive(Serialize, Clone, PartialEq)]
pub struct CellJson {
    pub char: String,
    pub fg: String,
    pub bg: String,
    #[serde(skip_serializing_if = "is_zero")]
    pub attrs: u8,
}
