import { useCallback, useEffect, useRef } from 'react';
import { useConnection, Message } from '../contexts/ConnectionContext';

type CellsMap = Record<string, TerminalCell[]>;

export interface TerminalCell {
  char: string;
  fg: string;
  bg: string;
  attrs?: number;
}

export interface TerminalState {
  buffer: TerminalCell[][];
  scrollbackLength: number;
  cursorX: number;
  cursorY: number;
  cols: number;
  rows: number;
  cursorVisible: boolean;
  cursorStyle: number;
  appCursorKeys: boolean;
  bracketedPaste: boolean;
  mouseMode: number;
  mouseEncoding: number;
  reverseVideo: boolean;
  title?: string;
}

export interface TerminalEvents {
  onState?: (terminalId: string, state: TerminalState) => void;
  onExit?: (terminalId: string, code: number) => void;
}

// SGR attribute bitmask constants (matches Rust ATTR_* values)
export const ATTR_BOLD = 1;
export const ATTR_DIM = 2;
export const ATTR_ITALIC = 4;
export const ATTR_UNDERLINE = 8;
export const ATTR_BLINK = 16;
export const ATTR_STRIKETHROUGH = 128;

export function useTerminal(events?: TerminalEvents) {
  const { sendControl, fireData, onDataEvent, status } = useConnection();
  const eventsRef = useRef(events);
  const buffersRef = useRef<Map<string, TerminalCell[][]>>(new Map());
  const modesRef = useRef<Map<string, Omit<TerminalState, 'buffer' | 'scrollbackLength' | 'cursorX' | 'cursorY' | 'cols' | 'rows'>>>(new Map());

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    const unsubscribe = onDataEvent((message: Message) => {
      if (message.ns !== 'terminal') return;

      if (message.action === 'state' && eventsRef.current?.onState) {
        const terminalId = message.payload.terminalId as string;
        const cells = message.payload.cells as CellsMap;
        const cursorX = message.payload.cursorX as number;
        const cursorY = message.payload.cursorY as number;
        const cols = message.payload.cols as number;
        const rows = message.payload.rows as number;
        const cursorVisible = message.payload.cursorVisible !== false;
        const cursorStyle = (message.payload.cursorStyle as number) || 0;
        const appCursorKeys = !!message.payload.appCursorKeys;
        const bracketedPaste = !!message.payload.bracketedPaste;
        const mouseMode = (message.payload.mouseMode as number) || 0;
        const mouseEncoding = (message.payload.mouseEncoding as number) || 0;
        const reverseVideo = !!message.payload.reverseVideo;
        const title = message.payload.title as string | undefined;

        // Get or create buffer
        let existing = buffersRef.current.get(terminalId);
        let buffer: TerminalCell[][];
        if (!existing || existing.length !== rows || (existing[0] && existing[0].length !== cols)) {
          buffer = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({ char: ' ', fg: 'default', bg: 'default' }))
          );
        } else {
          buffer = [...existing];
        }

        // Merge dirty rows
        for (const [rowIdx, row] of Object.entries(cells)) {
          const idx = parseInt(rowIdx, 10);
          if (idx >= 0 && idx < rows) {
            buffer[idx] = row;
          }
        }

        buffersRef.current.set(terminalId, buffer);

        const scrollbackLength = (message.payload.scrollbackLength as number) || 0;

        // Store mode state for the app to read
        modesRef.current.set(terminalId, {
          cursorVisible,
          cursorStyle,
          appCursorKeys,
          bracketedPaste,
          mouseMode,
          mouseEncoding,
          reverseVideo,
          title,
        });

        eventsRef.current.onState(terminalId, {
          buffer,
          scrollbackLength,
          cursorX,
          cursorY,
          cols,
          rows,
          cursorVisible,
          cursorStyle,
          appCursorKeys,
          bracketedPaste,
          mouseMode,
          mouseEncoding,
          reverseVideo,
          title,
        });
      }

      if (message.action === 'exit' && eventsRef.current?.onExit) {
        const terminalId = message.payload.terminalId as string;
        buffersRef.current.delete(terminalId);
        modesRef.current.delete(terminalId);
        eventsRef.current.onExit(terminalId, message.payload.code as number);
      }
    });

    return unsubscribe;
  }, [onDataEvent]);

  const isConnected = status === 'connected';
  const connectionNotReadyError = useCallback(() => new Error('Connection is reconnecting'), []);

  const spawn = useCallback(async (options: {
    shell?: string;
    cols?: number;
    rows?: number;
  } = {}): Promise<string> => {
    if (!isConnected) {
      throw connectionNotReadyError();
    }
    const response = await sendControl('terminal', 'spawn', {
      shell: options.shell,
      cols: options.cols ?? 80,
      rows: options.rows ?? 24,
    });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to spawn terminal');
    }
    return response.payload.terminalId as string;
  }, [connectionNotReadyError, isConnected, sendControl]);

  const write = useCallback((terminalId: string, data: string): void => {
    if (!isConnected) return;
    fireData('terminal', 'write', { terminalId, data });
  }, [fireData, isConnected]);

  const resize = useCallback(async (terminalId: string, cols: number, rows: number): Promise<void> => {
    if (!isConnected) {
      throw connectionNotReadyError();
    }
    const response = await sendControl('terminal', 'resize', { terminalId, cols, rows });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to resize terminal');
    }
  }, [connectionNotReadyError, isConnected, sendControl]);

  const kill = useCallback(async (terminalId: string): Promise<void> => {
    if (!isConnected) {
      throw connectionNotReadyError();
    }
    const response = await sendControl('terminal', 'kill', { terminalId });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to kill terminal');
    }
  }, [connectionNotReadyError, isConnected, sendControl]);

  const scroll = useCallback((terminalId: string, offset: number): void => {
    if (!isConnected) return;
    fireData('terminal', 'scroll', { terminalId, offset });
  }, [fireData, isConnected]);

  return {
    isConnected,
    spawn,
    write,
    resize,
    kill,
    scroll,
  };
}
