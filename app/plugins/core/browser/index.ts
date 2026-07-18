import { Globe } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import { BrowserAPI } from '../../gpi';
import BrowserPanel from './Panel';

// Browser plugin API implementation
const browserApi = (): BrowserAPI => ({
  navigate: async (url: string) => {
    // TODO: Implement
  },
  getCurrentUrl: async () => {
    // TODO: Implement
    return '';
  },
  reload: async () => {
    // TODO: Implement
  },
});

// Register the browser plugin
registerPlugin({
  id: 'browser',
  name: 'Browser',
  type: 'core',
  icon: Globe,
  component: BrowserPanel,
  defaultTitle: 'Browser',
  allowMultipleInstances: false,
  api: browserApi,
});

export { BrowserPanel };
