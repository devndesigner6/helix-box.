import { GitBranch } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import { GitAPI } from '../../gpi';
import GitPanel from './Panel';

// Git plugin API implementation
const gitApi = (): GitAPI => ({
  status: async () => {
    // TODO: Implement with real git
    return { staged: [], unstaged: [], untracked: [] };
  },
  stage: async (files: string[]) => {
  },
  unstage: async (files: string[]) => {
  },
  commit: async (message: string) => {
    return 'abc1234'; // mock commit hash
  },
  diff: async (file?: string) => {
    return '';
  },
  checkout: async (branch: string) => {
  },
  pull: async () => {
  },
  push: async () => {
  },
});

// Register the git plugin
registerPlugin({
  id: 'git',
  name: 'Git',
  type: 'extra',
  icon: GitBranch,
  component: GitPanel,
  defaultTitle: 'Git',
  allowMultipleInstances: true,
  api: gitApi,
});

export { GitPanel };
