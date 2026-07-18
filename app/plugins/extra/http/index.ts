import { ArrowLeftRight } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import { HttpAPI } from '../../gpi';
import HttpPanel from './Panel';

// HTTP plugin API implementation
const httpApi = (): HttpAPI => ({
  request: async (config) => {
    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body,
      });

      const body = await response.text();
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        status: response.status,
        headers,
        body,
      };
    } catch (error) {
      return {
        status: 0,
        headers: {},
        body: error instanceof Error ? error.message : 'Request failed',
      };
    }
  },
});

// Register the HTTP plugin
registerPlugin({
  id: 'http',
  name: 'API Client',
  type: 'extra',
  icon: ArrowLeftRight,
  component: HttpPanel,
  defaultTitle: 'API Client',
  allowMultipleInstances: true,
  api: httpApi,
});

export { HttpPanel };
