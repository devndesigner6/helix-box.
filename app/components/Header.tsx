import { ThemeColors, typography } from "@/constants/themes";
import { usePlugins } from "@/plugins/context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Plus, ChevronLeft } from "lucide-react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useHeaderHeight() {
  const { top: topInset } = useSafeAreaInsets();
  return topInset + 44;
}

export function HamburgerIcon({ color }: { color: string }) {
  return (
    <View style={{ justifyContent: "center", alignItems: "flex-start", gap: 4.5 }}>
      <View style={{ width: 17, height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ width: 13, height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ width: 20, height: 2, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
}

// Base tab interface - extend this for specific tab types
export interface BaseTab {
  id: string;
  title: string;
}

interface HeaderProps<T extends BaseTab> {
  // Optional title for simple headers (without tabs)
  title?: string;
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  rightAccessoryWidth?: number;
  onBack?: () => void;

  // Tab-based headers
  tabs?: T[];
  activeTabId?: string;
  onTabPress?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTab?: () => void;

  // Custom tab renderer for specialized tab displays
  renderTab?: (
    tab: T,
    isActive: boolean,
    isLast: boolean,
    showDivider: boolean,
    targetWidth: number,
    onPress: () => void,
    onClose: () => void,
    isNew: boolean
  ) => React.ReactElement | null;

  // Theme colors
  colors: ThemeColors;

  showBottomBorder?: boolean;

  // Optional: Custom width calculator based on tab count
  getTabWidth?: (count: number) => number;
}

const defaultGetTabWidth = (count: number): number => {
  if (count <= 0) return 120;
  if (count === 1) return 160;
  if (count === 2) return 140;
  return 120;
};

function Header<T extends BaseTab>({
  title,
  leftAccessory,
  rightAccessory,
  rightAccessoryWidth = 45,
  onBack,
  tabs,
  activeTabId,
  onTabPress,
  onTabClose,
  onNewTab,
  renderTab,
  colors,
  showBottomBorder = true,
  getTabWidth = defaultGetTabWidth,
}: HeaderProps<T>) {
  const navigation = useNavigation();
  const { setDrawerContentVariant } = usePlugins();
  const { top: topInset } = useSafeAreaInsets();
  const openDrawer = () => {
    setDrawerContentVariant("default");
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const triggerLightHaptic = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const openDrawerWithHaptic = () => {
    triggerLightHaptic();
    openDrawer();
  };
  const handlePrimaryHeaderPress = () => {
    triggerLightHaptic();
    if (onBack) {
      onBack();
      return;
    }
    openDrawer();
  };

  const tabsListRef = useRef<FlatList>(null);
  const prevTabIds = useRef<string[]>(tabs?.map((t) => t.id) || []);
  const prevTabCount = useRef(tabs?.length || 0);
  const scrollOffset = useRef(0);
  const [newTabIds, setNewTabIds] = useState<Set<string>>(new Set());

  const tabWidth = getTabWidth(tabs?.length || 0);

  // Handle tab changes - mark new tabs and scroll
  useEffect(() => {
    if (!tabs) return;

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
      if (!renderTab || !tabs || !activeTabId) return null;

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

  const headerHeight = topInset + 44;

  const headerStyle = [
    styles.headerWrapper,
    {
      height: headerHeight,
      backgroundColor: colors.bg.base,
      borderBottomWidth: showBottomBorder ? StyleSheet.hairlineWidth : 0,
      borderBottomColor: colors.border.secondary,
    },
  ];

  const headerBarStyle = [
    styles.headerBar,
    { height: headerHeight, paddingTop: topInset, paddingBottom: 10 },
  ];

  const spacer = <View style={{ height: headerHeight }} />;

  // Simple header (no tabs)
  if (!tabs || tabs.length === 0) {
    return (
      <>
        {spacer}
        <View style={headerStyle} pointerEvents="box-none">
          <View style={headerBarStyle}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={handlePrimaryHeaderPress} style={styles.menuButton}>
                {onBack ? <ChevronLeft size={22} color={colors.fg.default} strokeWidth={2} /> : <HamburgerIcon color={colors.fg.default} />}
              </TouchableOpacity>
              {leftAccessory}
              {title && (
                <Text style={[styles.title, { color: colors.fg.default }]} numberOfLines={1} ellipsizeMode="tail">
                  {title.length > 20 ? title.slice(0, 20) + "…" : title}
                </Text>
              )}
              {rightAccessory ? (
                <View style={[styles.rightAccessory, { width: rightAccessoryWidth, height: 45, alignItems: "center", justifyContent: "center" }]}>
                  {rightAccessory}
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </>
    );
  }

  // Tab-based header
  return (
    <>
      {spacer}
      <View style={headerStyle} pointerEvents="box-none">
        <View style={headerBarStyle}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={openDrawerWithHaptic} style={styles.menuButton}>
              <HamburgerIcon color={colors.fg.default} />
            </TouchableOpacity>
            {leftAccessory}

            <View style={styles.tabsContainer}>
              <FlatList
                ref={tabsListRef}
                data={tabs}
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
                    triggerLightHaptic();
                    onNewTab?.();
                  }}
                  style={styles.newTabButton}
                  activeOpacity={0.7}
                >
                  <Plus size={22} color={colors.fg.muted} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
            {rightAccessory ? <View style={styles.rightAccessory}>{rightAccessory}</View> : null}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBar: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  menuButton: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    marginRight: 4,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: "500",
    marginLeft: 6,
    flexShrink: 1,
  },
  rightAccessory: {
    marginLeft: "auto",
    marginRight: 0,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: "row",
    height: 60,
  },
  scrollContent: {
    paddingLeft: 4,
    paddingRight: 8,
    alignItems: "flex-end",
  },
  newTabButton: {
    width: 44,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(Header) as typeof Header;
