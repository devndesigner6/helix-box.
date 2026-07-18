import { Folder } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import { ExplorerAPI } from '../../gpi';
import ExplorerPanel from './Panel';

// Explorer plugin API implementation
const explorerApi = (): ExplorerAPI => ({
  list: async (path: string) => {
    // TODO: Implement with real file system
    return [];
  },
  create: async (path: string, type: 'file' | 'folder') => {
  },
  rename: async (from: string, to: string) => {
  },
  delete: async (path: string) => {
  },
  search: async (query: string, opts?: { regex?: boolean; glob?: string }) => {
    return [];
  },
});

// Register the explorer plugin
registerPlugin({
  id: 'explorer',
  name: 'Explorer',
  type: 'extra',
  icon: Folder,
  component: ExplorerPanel,
  defaultTitle: 'Explorer',
  allowMultipleInstances: true,
  api: explorerApi,
});

export { ExplorerPanel };
