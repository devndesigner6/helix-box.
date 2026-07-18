import { CodeXml } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import { EditorAPI } from '../../gpi';
import EditorPanel from './Panel';
import { getEditorController, openEditorFile } from './store';

// Editor plugin API implementation
const editorApi = (): EditorAPI => ({
  getOpenFiles: async () => {
    return getEditorController()?.getOpenFiles() ?? [];
  },
  openFile: async (path: string) => {
    await openEditorFile(path);
  },
  getCurrentFile: async () => {
    return getEditorController()?.getCurrentFile() ?? null;
  },
  insertText: async (text: string) => {
    await getEditorController()?.insertText(text);
  },
  getSelection: async () => {
    // TODO: Implement
    return null;
  },
  getFileTree: async () => {
    // TODO: Implement
    return [];
  },
  notifyFileRenamed: async (from: string, to: string) => {
    await getEditorController()?.notifyFileRenamed(from, to);
  },
  notifyFileDeleted: async (path: string) => {
    await getEditorController()?.notifyFileDeleted(path);
  },
});

// Register the editor plugin
registerPlugin({
  id: 'editor',
  name: 'Editor',
  type: 'core',
  icon: CodeXml,
  component: EditorPanel,
  defaultTitle: 'Editor',
  allowMultipleInstances: false,
  api: editorApi,
});

export { EditorPanel };
