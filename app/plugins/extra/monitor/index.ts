import { Activity } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import { MonitorAPI } from '../../gpi';
import MonitorPanel from './Panel';

// Monitor plugin API implementation
const monitorApi = (): MonitorAPI => ({
  getCpuUsage: async () => {
    // TODO: Implement with systeminformation
    return { usage: 0, cores: [] };
  },
  getMemory: async () => {
    // TODO: Implement with systeminformation
    return { total: 0, used: 0, free: 0, usedPercent: 0 };
  },
  getDisk: async () => {
    // TODO: Implement with systeminformation
    return [];
  },
  getBattery: async () => {
    // TODO: Implement with systeminformation
    return { percent: 100, charging: false, hasBattery: false };
  },
});

// Register the monitor plugin
registerPlugin({
  id: 'monitor',
  name: 'Monitor',
  type: 'extra',
  icon: Activity,
  component: MonitorPanel,
  defaultTitle: 'Monitor',
  allowMultipleInstances: true,
  api: monitorApi,
});

export { MonitorPanel };
