import { SquareTerminal } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import { TerminalAPI } from '../../gpi';
import TerminalPanel from './Panel';

// Terminal plugin API implementation
const terminalApi = (): TerminalAPI => ({
  runCommand: async (cmd: string) => {
    // TODO: Implement when connected to real terminal
    return { exitCode: 0, output: '' };
  },
  sendInput: async (input: string) => {
    // TODO: Implement
  },
  clear: async () => {
    // TODO: Implement
  },
});

// Register the terminal plugin
registerPlugin({
  id: 'terminal',
  name: 'Terminal',
  type: 'core',
  icon: SquareTerminal,
  component: TerminalPanel,
  defaultTitle: 'Terminal',
  allowMultipleInstances: false,
  api: terminalApi,
});

export { TerminalPanel };
