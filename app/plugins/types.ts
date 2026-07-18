import { ComponentType } from 'react';

// Icon props compatible with lucide-react-native
// Lucide icons accept size (single value) or width/height separately
export interface IconProps {
  width?: number;
  height?: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Plugin types
export type PluginType = 'core' | 'extra';

// Plugin API - functions exposed by a plugin for cross-plugin communication
export interface PluginAPI {
  [method: string]: (...args: any[]) => Promise<any>;
}

// Plugin instance - represents an open tab of a plugin
export interface PluginInstance {
  id: string;           // unique instance id
  pluginId: string;     // which plugin this is an instance of
  title: string;        // tab title
  state?: any;          // instance-specific state
}

// Plugin definition - the blueprint for a plugin
export interface PluginDefinition<T extends PluginAPI = PluginAPI> {
  id: string;
  name: string;
  description?: string;
  type: PluginType;
  icon: ComponentType<IconProps>;
  component: ComponentType<PluginPanelProps>;

  // Default tab title for new instances
  defaultTitle?: string;

  // Whether multiple instances are allowed (default: true for extra, false for core)
  allowMultipleInstances?: boolean;

  // The API this plugin exposes to other plugins via GPI
  api?: () => T;

  // Get title for a specific instance
  getInstanceTitle?: (instance: PluginInstance) => string;
}

// Props passed to plugin panel components
export interface PluginPanelProps {
  instanceId: string;
  isActive: boolean;
  bottomBarHeight: number;
}

// Bottom bar configuration
export interface BottomBarConfig {
  row1Slot5: string | null;  // which extra plugin in 5th slot of row 1
  row2: (string | null)[];   // 6 slots for extra plugins in row 2
}

// Workspace state - tracks open tabs and layout
export interface WorkspaceState {
  openTabs: PluginInstance[];
  activeTabId: string;
  bottomBar: BottomBarConfig;
}

// Default bottom bar configuration
export const DEFAULT_BOTTOM_BAR_CONFIG: BottomBarConfig = {
  row1Slot5: 'explorer',
  row2: [null, null, null, null, null, null],
};

// Core plugin IDs (cannot be removed, always have one instance)
// Order: AI, Browser, Editor, Terminal
export const CORE_PLUGIN_IDS = ['ai', 'browser', 'editor', 'terminal'] as const;
export type CorePluginId = typeof CORE_PLUGIN_IDS[number];

// Check if a plugin is a core plugin
export function isCorePlugin(pluginId: string): pluginId is CorePluginId {
  return CORE_PLUGIN_IDS.includes(pluginId as CorePluginId);
}
