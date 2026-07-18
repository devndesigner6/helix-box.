import React, { memo, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { usePlugins } from '@/plugins';
import { PluginPanelProps } from '@/plugins/types';
import { useTranslation } from 'react-i18next';

// Memoized panel wrapper - only re-renders when isActive changes
const MemoizedPanel = memo(function MemoizedPanel({
  component: PanelComponent,
  instanceId,
  isActive,
  bottomBarHeight,
}: {
  component: React.ComponentType<PluginPanelProps>;
  instanceId: string;
  isActive: boolean;
  bottomBarHeight: number;
}) {
  return (
    <View
      style={[
        styles.panel,
        // Use absolute + opacity for inactive instead of display:none
        // display:none causes Reanimated to set ref.current=undefined on frozen objects
        !isActive && styles.hiddenPanel,
      ]}
      pointerEvents={isActive ? 'auto' : 'none'}
    >
      <PanelComponent instanceId={instanceId} isActive={isActive} bottomBarHeight={bottomBarHeight} />
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if isActive changes
  // or if it's active and instanceId changed (shouldn't happen)
  if (prevProps.isActive !== nextProps.isActive) return false;
  if (prevProps.instanceId !== nextProps.instanceId) return false;
  if (prevProps.bottomBarHeight !== nextProps.bottomBarHeight) return false;
  // Don't re-render inactive panels at all
  if (!nextProps.isActive) return true;
  return true;
});

export default function PluginRenderer({ paddingBottom = 0, bottomBarHeight = 0 }: { paddingBottom?: number; bottomBarHeight?: number }) {
  const { colors } = useTheme();
  const { openTabs, activeTabId, getPlugin } = usePlugins();
  const { t } = useTranslation();

  // Memoize the tabs to render - only changes when openTabs changes
  const tabsToRender = useMemo(() => {
    return openTabs.map((tab) => {
      const plugin = getPlugin(tab.pluginId);
      if (!plugin) return null;
      return {
        id: tab.id,
        pluginId: tab.pluginId,
        component: plugin.component,
      };
    }).filter(Boolean);
  }, [openTabs, getPlugin]);

  // Track which tabs have ever been active - don't mount until first activated
  const mountedTabIds = useRef<Set<string>>(new Set());
  if (activeTabId) mountedTabIds.current.add(activeTabId);

  // Get the active tab for empty state check
  const activeTab = openTabs.find(t => t.id === activeTabId);

  if (!activeTab) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg.base, paddingBottom }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.fg.muted }]}>{t('pluginRenderer.noActiveTab')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom }]}>
      {tabsToRender.map((tab) => {
        if (!tab) return null;
        // Don't render until the tab has been active at least once
        if (!mountedTabIds.current.has(tab.id)) return null;
        const isActive = tab.id === activeTabId;

        return (
          <MemoizedPanel
            key={tab.id}
            component={tab.component}
            instanceId={tab.id}
            isActive={isActive}
            bottomBarHeight={bottomBarHeight}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  panel: {
    flex: 1,
  },
  hiddenPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
