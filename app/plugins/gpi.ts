import { pluginRegistry } from './registry';
import { PluginAPI } from './types';

/**
 * Global Plugin Interface (GPI)
 *
 * Provides a type-safe way for plugins to communicate with each other.
 * Each plugin can expose an API that other plugins can call.
 *
 * Usage:
 *   await gPI.editor.openFile('/src/app.tsx')
 *   await gPI.terminal.runCommand('npm run build')
 *   await gPI.git.commit('fix: resolve bug')
 */

// Known plugin APIs for type safety
export interface EditorAPI extends PluginAPI {
  getOpenFiles(): Promise<string[]>;
  openFile(path: string): Promise<void>;
  getCurrentFile(): Promise<string | null>;
  insertText(text: string): Promise<void>;
  getSelection(): Promise<{ start: number; end: number; text: string } | null>;
  getFileTree(): Promise<any[]>;
  notifyFileRenamed(from: string, to: string): Promise<void>;
  notifyFileDeleted(path: string): Promise<void>;
}

export interface TerminalAPI extends PluginAPI {
  runCommand(cmd: string): Promise<{ exitCode: number; output: string }>;
  sendInput(input: string): Promise<void>;
  clear(): Promise<void>;
}

export interface GitAPI extends PluginAPI {
  status(): Promise<any>;
  stage(files: string[]): Promise<void>;
  unstage(files: string[]): Promise<void>;
  commit(message: string): Promise<string>;
  diff(file?: string): Promise<string>;
  checkout(branch: string): Promise<void>;
  pull(): Promise<void>;
  push(): Promise<void>;
}

export interface BrowserAPI extends PluginAPI {
  navigate(url: string): Promise<void>;
  getCurrentUrl(): Promise<string>;
  reload(): Promise<void>;
}

export interface AIAPI extends PluginAPI {
  sendMessage(message: string): Promise<string>;
  clearChat(): Promise<void>;
}

export interface ExplorerAPI extends PluginAPI {
  list(path: string): Promise<any[]>;
  create(path: string, type: 'file' | 'folder'): Promise<void>;
  rename(from: string, to: string): Promise<void>;
  delete(path: string): Promise<void>;
  search(query: string, opts?: { regex?: boolean; glob?: string }): Promise<any[]>;
}

export interface ProcessesAPI extends PluginAPI {
  list(): Promise<any[]>;
  kill(pid: number): Promise<void>;
  getOutput(channel: string): Promise<string>;
  clearOutput(channel?: string): Promise<void>;
}

export interface HttpAPI extends PluginAPI {
  request(config: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
  }): Promise<any>;
}

export interface PortsAPI extends PluginAPI {
  list(): Promise<{ port: number; pid: number; process: string }[]>;
  kill(port: number): Promise<void>;
  isAvailable(port: number): Promise<boolean>;
}

export interface ToolsAPI extends PluginAPI {
  formatJson(input: string, indent?: number): Promise<string>;
  formatXml(input: string): Promise<string>;
  validateJson(input: string): Promise<{ valid: boolean; error?: string }>;
  validateXml(input: string): Promise<{ valid: boolean; error?: string }>;
  base64Encode(input: string): Promise<string>;
  base64Decode(input: string): Promise<string>;
  urlEncode(input: string): Promise<string>;
  urlDecode(input: string): Promise<string>;
  hash(input: string, algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512'): Promise<string>;
  stringOps(input: string, operation: string): Promise<string>;
  unixToDate(timestamp: number): Promise<string>;
  dateToUnix(date: string): Promise<number>;
}

export interface MonitorAPI extends PluginAPI {
  getCpuUsage(): Promise<{ usage: number; cores: number[] }>;
  getMemory(): Promise<{ total: number; used: number; free: number; usedPercent: number }>;
  getDisk(): Promise<{ mount: string; size: number; used: number; usedPercent: number }[]>;
  getBattery(): Promise<{ percent: number; charging: boolean; hasBattery: boolean }>;
}

// GPI type registry
export interface GPIRegistry {
  editor: EditorAPI;
  terminal: TerminalAPI;
  git: GitAPI;
  browser: BrowserAPI;
  ai: AIAPI;
  explorer: ExplorerAPI;
  processes: ProcessesAPI;
  http: HttpAPI;
  ports: PortsAPI;
  tools: ToolsAPI;
  monitor: MonitorAPI;
  [key: string]: PluginAPI;
}

// Create a proxy-based GPI that dynamically resolves plugin APIs
function createGPI(): GPIRegistry {
  return new Proxy({} as GPIRegistry, {
    get(_, pluginId: string): PluginAPI {
      const plugin = pluginRegistry.get(pluginId);

      if (!plugin) {
        // Return a proxy that throws helpful errors
        return new Proxy({} as PluginAPI, {
          get(_, method: string) {
            return async () => {
              throw new Error(`Plugin "${pluginId}" is not registered. Available plugins: ${pluginRegistry.getPluginIds().join(', ')}`);
            };
          }
        });
      }

      if (!plugin.api) {
        // Return a proxy that throws helpful errors
        return new Proxy({} as PluginAPI, {
          get(_, method: string) {
            return async () => {
              throw new Error(`Plugin "${pluginId}" does not expose an API`);
            };
          }
        });
      }

      return plugin.api();
    }
  });
}

// Export the global plugin interface
export const gPI = createGPI();
