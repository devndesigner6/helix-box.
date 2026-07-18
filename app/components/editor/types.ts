export interface EditorConfig {
  fontSize: number;
  wrapLines: boolean;
  autoSave: boolean;
  aiFontSize: number;
}

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  fontSize: 12,
  wrapLines: false,
  autoSave: true,
  aiFontSize: 14,
};
