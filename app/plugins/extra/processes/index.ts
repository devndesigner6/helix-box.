import { List } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import { ProcessesAPI } from '../../gpi';
import ProcessesPanel from './Panel';

// Processes plugin API implementation
const processesApi = (): ProcessesAPI => ({
  list: async () => {
    // TODO: Implement with real process list
    return [];
  },
  kill: async (pid: number) => {
  },
  getOutput: async (channel: string) => {
    return '';
  },
  clearOutput: async (channel?: string) => {
  },
});

// Register the processes plugin
registerPlugin({
  id: 'processes',
  name: 'Processes',
  type: 'extra',
  icon: List,
  component: ProcessesPanel,
  defaultTitle: 'Processes',
  allowMultipleInstances: true,
  api: processesApi,
});

export { ProcessesPanel };
