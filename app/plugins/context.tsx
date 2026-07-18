import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { logger } from '@/lib/logger';
import { pluginRegistry } from './registry';
import { innerApi } from './innerApi';
import {
  BottomBarConfig,
  CORE_PLUGIN_IDS,
  DEFAULT_BOTTOM_BAR_CONFIG,
  isCorePlugin,
  PluginDefinition,
  PluginInstance,
  WorkspaceState,
} from './types';

const BOTTOM_BAR_STORAGE_KEY = '@lunel_bottom_bar';
const WORKSPACE_STORAGE_KEY = '@lunel_workspace';

interface PluginContextType {
  // Plugin registry access
  plugins: PluginDefinition[];
  corePlugins: PluginDefinition[];
  extraPlugins: PluginDefinition[];
  getPlugin: (id: string) => PluginDefinition | undefined;

  // Workspace state
  openTabs: PluginInstance[];
  activeTabId: string;

  // Tab management
  openTab: (pluginId: string, state?: any) => string;
  closeTab: (instanceId: string) => boolean;
  setActiveTab: (instanceId: string) => void;
  getActiveTab: () => PluginInstance | undefined;
  canCloseTab: (instanceId: string) => boolean;

  // Bottom bar config
  bottomBarConfig: BottomBarConfig;
  updateBottomBar: (config: Partial<BottomBarConfig>) => void;
  setRow1Slot5: (pluginId: string | null) => void;
  setRow2Slot: (index: number, pluginId: string | null) => void;
  drawerContentVariant: "default" | "editor-files";
  setDrawerContentVariant: (variant: "default" | "editor-files") => void;

  // Initialization
  isLoading: boolean;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

function sanitizeBottomBarConfig(config: Partial<BottomBarConfig>): BottomBarConfig {
  const row1Slot5 =
    config.row1Slot5 && pluginRegistry.has(config.row1Slot5) ? config.row1Slot5 : null;
  const row2 = Array.from({ length: 6 }, (_, index) => {
    const pluginId = config.row2?.[index] ?? null;
    return pluginId && pluginRegistry.has(pluginId) ? pluginId : null;
  });

  return { row1Slot5, row2 };
}

// Generate unique instance ID
function generateInstanceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function PluginProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [openTabs, setOpenTabs] = useState<PluginInstance[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [bottomBarConfig, setBottomBarConfig] = useState<BottomBarConfig>(DEFAULT_BOTTOM_BAR_CONFIG);
  const [drawerContentVariant, setDrawerContentVariant] = useState<"default" | "editor-files">("default");

  // Get plugins from registry
  const plugins = useMemo(() => pluginRegistry.getAll(), []);
  const corePlugins = useMemo(() => pluginRegistry.getCorePlugins(), []);
  const extraPlugins = useMemo(() => pluginRegistry.getExtraPlugins(), []);

  const getPlugin = useCallback((id: string) => pluginRegistry.get(id), []);

  // Initialize core plugin tabs and load saved state
  useEffect(() => {
    async function initialize() {
      logger.info('plugins', 'initialization started');
      try {
        // Load saved bottom bar config
        const savedBottomBar = await AsyncStorage.getItem(BOTTOM_BAR_STORAGE_KEY);
        if (savedBottomBar) {
          try {
            const parsed = JSON.parse(savedBottomBar);
            setBottomBarConfig(sanitizeBottomBarConfig({
              ...DEFAULT_BOTTOM_BAR_CONFIG,
              ...parsed,
            }));
            logger.info('plugins', 'restored bottom bar config');
          } catch (e) {
            logger.warn('plugins', 'failed to parse saved bottom bar config', {
              error: e instanceof Error ? e.message : String(e),
            });
          }
        }

        // Load saved workspace or create default
        const savedWorkspace = await AsyncStorage.getItem(WORKSPACE_STORAGE_KEY);
        if (savedWorkspace) {
          try {
            const parsed: WorkspaceState = JSON.parse(savedWorkspace);
            // Validate tabs - ensure core plugins exist, and refresh titles from registry
            const validTabs = parsed.openTabs
              .filter(tab => pluginRegistry.has(tab.pluginId))
              .map(tab => {
                const plugin = pluginRegistry.get(tab.pluginId);
                return { ...tab, title: plugin?.defaultTitle || plugin?.name || tab.title };
              });

            // Ensure all core plugins have at least one tab
            const coreTabPluginIds = new Set(
              validTabs.filter(t => isCorePlugin(t.pluginId)).map(t => t.pluginId)
            );

            for (const coreId of CORE_PLUGIN_IDS) {
              if (!coreTabPluginIds.has(coreId)) {
                const plugin = pluginRegistry.get(coreId);
                if (plugin) {
                  validTabs.unshift({
                    id: generateInstanceId(),
                    pluginId: coreId,
                    title: plugin.defaultTitle || plugin.name,
                  });
                }
              }
            }

            setOpenTabs(validTabs);
            setActiveTabId(parsed.activeTabId || validTabs[0]?.id || '');
            logger.info('plugins', 'restored workspace', {
              tabCount: validTabs.length,
              activeTabId: parsed.activeTabId || validTabs[0]?.id || '',
            });
          } catch (e) {
            logger.warn('plugins', 'failed to parse saved workspace', {
              error: e instanceof Error ? e.message : String(e),
            });
            initializeDefaultTabs();
          }
        } else {
          initializeDefaultTabs();
        }
      } catch (error) {
        logger.error('plugins', 'failed to load plugin state', {
          error: error instanceof Error ? error.message : String(error),
        });
        initializeDefaultTabs();
      } finally {
        logger.info('plugins', 'initialization finished');
        setIsLoading(false);
      }
    }

    function initializeDefaultTabs() {
      // Create one tab for each core plugin
      const initialTabs: PluginInstance[] = CORE_PLUGIN_IDS.map(pluginId => {
        const plugin = pluginRegistry.get(pluginId);
        return {
          id: generateInstanceId(),
          pluginId,
          title: plugin?.defaultTitle || plugin?.name || pluginId,
        };
      }).filter(Boolean);

      setOpenTabs(initialTabs);
      setActiveTabId(initialTabs[0]?.id || '');
      logger.info('plugins', 'initialized default tabs', {
        tabCount: initialTabs.length,
        pluginIds: initialTabs.map((tab) => tab.pluginId),
      });
    }

    initialize();
  }, []);

  // Persist workspace state on changes
  useEffect(() => {
    if (!isLoading && openTabs.length > 0) {
      const workspace: WorkspaceState = {
        openTabs,
        activeTabId,
        bottomBar: bottomBarConfig,
      };
      logger.info('plugins', 'persisting workspace', {
        tabCount: openTabs.length,
        activeTabId,
      });
      AsyncStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
    }
  }, [openTabs, activeTabId, bottomBarConfig, isLoading]);

  // Persist bottom bar config
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(BOTTOM_BAR_STORAGE_KEY, JSON.stringify(bottomBarConfig));
    }
  }, [bottomBarConfig, isLoading]);

  // Open a plugin (single instance per plugin)
  const openTab = useCallback((pluginId: string, state?: any): string => {
    const plugin = pluginRegistry.get(pluginId);
    if (!plugin) {
      logger.warn('plugins', 'openTab called for unknown plugin', { pluginId });
      return '';
    }

    // Check if instance already exists - always single instance per plugin
    const existingTab = openTabs.find(t => t.pluginId === pluginId);
    if (existingTab) {
      logger.info('plugins', 'reusing existing tab', { pluginId, instanceId: existingTab.id });
      setActiveTabId(existingTab.id);
      // Refresh bottom bar after state change
      setTimeout(() => innerApi.refreshBottomBar(), 0);
      return existingTab.id;
    }

    // Create new instance (first time opening this plugin)
    const newTab: PluginInstance = {
      id: generateInstanceId(),
      pluginId,
      title: plugin.defaultTitle || plugin.name,
      state,
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    logger.info('plugins', 'opened new tab', { pluginId, instanceId: newTab.id });
    // Refresh bottom bar after state change
    setTimeout(() => innerApi.refreshBottomBar(), 0);
    return newTab.id;
  }, [openTabs]);

  // Close a tab
  const closeTab = useCallback((instanceId: string): boolean => {
    const tab = openTabs.find(t => t.id === instanceId);
    if (!tab) return false;

    // Core plugins cannot be closed (only one instance exists)
    if (isCorePlugin(tab.pluginId)) {
      logger.warn('plugins', 'attempted to close core tab', { instanceId, pluginId: tab.pluginId });
      return false;
    }

    const newTabs = openTabs.filter(t => t.id !== instanceId);
    setOpenTabs(newTabs);
    logger.info('plugins', 'closed tab', { instanceId, pluginId: tab.pluginId, remainingTabs: newTabs.length });

    // If closing active tab, switch to previous or next tab
    if (activeTabId === instanceId && newTabs.length > 0) {
      const currentIndex = openTabs.findIndex(t => t.id === instanceId);
      const newActiveIndex = Math.max(0, currentIndex - 1);
      setActiveTabId(newTabs[newActiveIndex]?.id || newTabs[0]?.id || '');
    }

    // Refresh bottom bar after state change
    setTimeout(() => innerApi.refreshBottomBar(), 0);
    return true;
  }, [openTabs, activeTabId]);

  // Set active tab
  const setActiveTab = useCallback((instanceId: string) => {
    const tab = openTabs.find(t => t.id === instanceId);
    if (tab) {
      setActiveTabId(instanceId);
      logger.info('plugins', 'active tab changed', { instanceId, pluginId: tab.pluginId });
      // Refresh bottom bar after state change
      setTimeout(() => innerApi.refreshBottomBar(), 0);
    }
  }, [openTabs]);

  // Get active tab
  const getActiveTab = useCallback((): PluginInstance | undefined => {
    return openTabs.find(t => t.id === activeTabId);
  }, [openTabs, activeTabId]);

  // Check if a tab can be closed
  const canCloseTab = useCallback((instanceId: string): boolean => {
    const tab = openTabs.find(t => t.id === instanceId);
    if (!tab) return false;
    return !isCorePlugin(tab.pluginId);
  }, [openTabs]);

  // Update bottom bar config
  const updateBottomBar = useCallback((config: Partial<BottomBarConfig>) => {
    setBottomBarConfig(prev => ({ ...prev, ...config }));
    // Refresh bottom bar after config change
    setTimeout(() => innerApi.refreshBottomBar(), 0);
  }, []);

  // Set row 1 slot 5
  const setRow1Slot5 = useCallback((pluginId: string | null) => {
    setBottomBarConfig(prev => ({ ...prev, row1Slot5: pluginId }));
    // Refresh bottom bar after config change
    setTimeout(() => innerApi.refreshBottomBar(), 0);
  }, []);

  // Set row 2 slot
  const setRow2Slot = useCallback((index: number, pluginId: string | null) => {
    if (index < 0 || index >= 6) return;
    setBottomBarConfig(prev => {
      const newRow2 = [...prev.row2];
      newRow2[index] = pluginId;
      return { ...prev, row2: newRow2 };
    });
    // Refresh bottom bar after config change
    setTimeout(() => innerApi.refreshBottomBar(), 0);
  }, []);

  useEffect(() => {
    const showPlugin = (pluginId: string) => {
      const activeTab = openTabs.find((tab) => tab.id === activeTabId);
      if (activeTab?.pluginId === pluginId) {
        return;
      }

      const existingTab = openTabs.find((tab) => tab.pluginId === pluginId);
      if (existingTab) {
        setActiveTab(existingTab.id);
        return;
      }

      openTab(pluginId);
    };

    innerApi.registerPluginNavigation(showPlugin);
    return () => innerApi.unregisterPluginNavigation();
  }, [activeTabId, openTab, openTabs, setActiveTab]);

  const value: PluginContextType = {
    plugins,
    corePlugins,
    extraPlugins,
    getPlugin,
    openTabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    getActiveTab,
    canCloseTab,
    bottomBarConfig,
    updateBottomBar,
    setRow1Slot5,
    setRow2Slot,
    drawerContentVariant,
    setDrawerContentVariant,
    isLoading,
  };

  return (
    <PluginContext.Provider value={value}>
      {children}
    </PluginContext.Provider>
  );
}

export function usePlugins() {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
}
