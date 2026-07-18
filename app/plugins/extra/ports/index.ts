import { Wifi } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import { PortsAPI } from '../../gpi';
import PortsPanel from './Panel';

// Ports plugin API implementation
const portsApi = (): PortsAPI => ({
  list: async () => {
    // TODO: Implement with real port list
    return [];
  },
  kill: async (port: number) => {
  },
  isAvailable: async (port: number) => {
    return true;
  },
});

// Register the ports plugin
registerPlugin({
  id: 'ports',
  name: 'Ports',
  type: 'extra',
  icon: Wifi,
  component: PortsPanel,
  defaultTitle: 'Ports',
  allowMultipleInstances: true,
  api: portsApi,
});

export { PortsPanel };
