type LogValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | LogValue[]
  | { [key: string]: LogValue };

type LogFields = Record<string, LogValue>;

export const logger = {
  info(_scope: string, _message: string, _fields?: LogFields) {
    // Manual app diagnostics are disabled for normal runtime output.
  },
  warn(_scope: string, _message: string, _fields?: LogFields) {
    // Manual app diagnostics are disabled for normal runtime output.
  },
  error(_scope: string, _message: string, _fields?: LogFields) {
    // Manual app diagnostics are disabled for normal runtime output.
  },
};
