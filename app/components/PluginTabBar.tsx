import { ThemeColors } from "@/constants/themes";
import * as Haptics from "expo-haptics";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Plus } from "lucide-react-native";
import { BaseTab } from "@/components/Header";

interface PluginTabBarProps<T extends BaseTab> {
  tabs: T[];
  activeTabId?: string;
  onTabPress?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTab?: () => void;
  renderTab: (
    tab: T,
    isActive: boolean,
    isLast: boolean,
    showDivider: boolean,
    targetWidth: number,
    onPress: () => void,
    onClose: () => void,
    isNew: boolean
  ) => React.ReactElement | null;
  colors: ThemeColors;
  getTabWidth?: (count: number) => number;
}

const TAB_MAX_WIDTH = 140;

const defaultGetTabWidth = (count: number): number => TAB_MAX_WIDTH;

function PluginTabBar<T extends BaseTab>({
  tabs,
  activeTabId,
  onTabPress,
  onTabClose,
  onNewTab,
  renderTab,
  colors,
  getTabWidth = defaultGetTabWidth,
}: PluginTabBarProps<T>) {
  const tabsListRef = useRef<FlatList>(null);
  const prevTabIds = useRef<string[]>(tabs.map((t) => t.id));
  const prevTabCount = useRef(tabs.length);
  const scrollOffset = useRef(0);
  const [newTabIds, setNewTabIds] = useState<Set<string>>(new Set());
  const [tabsListWidth, setTabsListWidth] = useState(0);

  const tabWidth = Math.min(getTabWidth(tabs.length), TAB_MAX_WIDTH);

  useEffect(() => {
    const currentIds = tabs.map((t) => t.id);
    const addedIds = currentIds.filter(
      (id) => !prevTabIds.current.includes(id)
    );
    const wasTabRemoved = tabs.length < prevTabCount.current;

    if (addedIds.length > 0) {
      setNewTabIds(new Set(addedIds));
      setTimeout(() => {
        tabsListRef.current?.scrollToEnd({ animated: true });
      }, 50);
      setTimeout(() => setNewTabIds(new Set()), 300);
    }

    if (wasTabRemoved && tabs.length > 0) {
      const newContentWidth = tabs.length * (tabWidth + 2);
      const maxOffset = Math.max(0, newContentWidth - 200);
      if (scrollOffset.current > maxOffset) {
        setTimeout(() => {
          tabsListRef.current?.scrollToOffset({
            offset: maxOffset,
            animated: true,
          });
        }, 50);
      }
    }

    prevTabIds.current = currentIds;
    prevTabCount.current = tabs.length;
  }, [tabs, tabWidth]);

  const renderTabItem = useCallback(
    ({ item, index }: { item: T; index: number }): React.ReactElement | null => {
      if (!activeTabId) return null;

      const isActive = activeTabId === item.id;
      const isLast = index === tabs.length - 1;
      const nextTabIsActive =
        index < tabs.length - 1 && tabs[index + 1].id === activeTabId;
      const showDivider = !isLast && !isActive && !nextTabIsActive;
      const isNew = newTabIds.has(item.id);

      return renderTab(
        item,
        isActive,
        isLast,
        showDivider,
        tabWidth,
        () => onTabPress?.(item.id),
        () => onTabClose?.(item.id),
        isNew
      );
    },
    [renderTab, tabs, activeTabId, tabWidth, newTabIds, onTabPress, onTabClose]
  );

  if (tabs.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.bg.raised,
          borderBottomColor: colors.bg.raised,
        },
      ]}
    >
      <FlatList
        ref={tabsListRef}
        data={tabs}
        style={styles.tabsList}
        onLayout={(e) => setTabsListWidth(e.nativeEvent.layout.width)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyExtractor={(item) => item.id}
        renderItem={renderTabItem}
        getItemLayout={(_, index) => ({
          length: tabWidth + 2,
          offset: (tabWidth + 2) * index,
          index,
        })}
        onScroll={(e) => {
          scrollOffset.current = e.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
      />

      {onNewTab && (
        <TouchableOpacity
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onNewTab?.();
          }}
          style={styles.newTabButton}
          activeOpacity={0.7}
        >
          <Plus size={22} color={colors.fg.muted} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    alignItems: "stretch",
    height: 34,
    borderBottomWidth: 1,
  },
  tabsList: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "stretch",
    paddingLeft: 8,
  },
  newTabButton: {
    width: 46,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(PluginTabBar) as typeof PluginTabBar;
