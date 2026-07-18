import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import Header, { useHeaderHeight } from "@/components/Header";
import { usePlugins, CORE_PLUGIN_IDS } from '@/plugins';
import { Lock, Plus, Grid3x3, X, CheckCircle2 } from 'lucide-react-native';
import { PluginDefinition } from '@/plugins/types';
import { useTranslation } from 'react-i18next';

type SlotTarget = { type: 'row1' } | { type: 'row2'; index: number };

export default function BottomBarSettings() {
  const { colors, fonts, spacing, radius } = useTheme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();
  const {
    extraPlugins,
    getPlugin,
    bottomBarConfig,
    setRow1Slot5,
    setRow2Slot,
  } = usePlugins();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<SlotTarget | null>(null);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const pickerBackdropOpacity = useRef(new Animated.Value(0)).current;
  const pickerSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Picker modal animations
  useEffect(() => {
    if (pickerVisible) {
      setPickerModalVisible(true);
      Animated.parallel([
        Animated.timing(pickerBackdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(pickerSlideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(pickerBackdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pickerSlideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPickerModalVisible(false);
      });
    }
  }, [pickerVisible]);

  const row2Slots = bottomBarConfig.row2;

  // Get plugins available for a specific slot
  const getAvailablePlugins = (target: SlotTarget): PluginDefinition[] => {
    const usedIds = new Set<string>();

    // Add row1 slot5 if not current target
    if (bottomBarConfig.row1Slot5 && target.type !== 'row1') {
      usedIds.add(bottomBarConfig.row1Slot5);
    }

    // Add row2 slots except current
    row2Slots.forEach((id, index) => {
      if (id && !(target.type === 'row2' && target.index === index)) {
        usedIds.add(id);
      }
    });

    return extraPlugins.filter(p => !usedIds.has(p.id));
  };

  const openPicker = (target: SlotTarget) => {
    setPickerTarget(target);
    setPickerVisible(true);
  };

  const handleSelectPlugin = (pluginId: string | null) => {
    if (!pickerTarget) return;

    if (pickerTarget.type === 'row1') {
      setRow1Slot5(pluginId);
    } else {
      setRow2Slot(pickerTarget.index, pluginId);
    }

    setPickerVisible(false);
    setPickerTarget(null);
  };

  const getCurrentPluginForTarget = (target: SlotTarget): string | null => {
    if (target.type === 'row1') {
      return bottomBarConfig.row1Slot5;
    }
    return row2Slots[target.index] || null;
  };

  // Render the live preview
  const renderPreview = () => {
    const row1Extra = bottomBarConfig.row1Slot5 ? getPlugin(bottomBarConfig.row1Slot5) : null;
    const row2Plugins = row2Slots.map(id => id ? getPlugin(id) : null);

    return (
      <View style={{
        backgroundColor: colors.bg.raised,
        borderRadius: 10,
        padding: spacing[3],
        marginHorizontal: spacing[3],
        marginBottom: spacing[5],
      }}>
        <Text style={{
          fontSize: 12,
          fontFamily: fonts.sans.medium,
          color: colors.fg.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: spacing[2],
          textAlign: 'center',
        }}>
          {t('common.preview')}
        </Text>

        {/* Row 1 Preview */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: spacing[2],
        }}>
          {CORE_PLUGIN_IDS.map((id) => {
            const plugin = getPlugin(id);
            if (!plugin) return null;
            const Icon = plugin.icon;
            return (
              <View key={id} style={{ alignItems: 'center', padding: spacing[2] }}>
                <Icon width={22} height={22} color={colors.fg.muted} strokeWidth={1.5} />
              </View>
            );
          })}
          {row1Extra ? (
            <View style={{ alignItems: 'center', padding: spacing[2] }}>
              <row1Extra.icon width={22} height={22} color={colors.fg.muted} strokeWidth={1.5} />
            </View>
          ) : (
            <View style={{ alignItems: 'center', padding: spacing[2] }}>
              <Plus width={22} height={22} color={colors.accent.default} strokeWidth={2} />
            </View>
          )}
          {/* Tabs button - always shown, not customizable */}
          <View style={{ alignItems: 'center', padding: spacing[2], opacity: 0.4 }}>
            <Grid3x3 width={22} height={22} color={colors.fg.muted} strokeWidth={1.5} />
          </View>
        </View>

        {/* Row 2 Preview */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
          {row2Plugins.map((plugin, index) => (
            <View key={index} style={{ alignItems: 'center', padding: spacing[2] }}>
              {plugin ? (
                <plugin.icon width={20} height={20} color={colors.fg.muted} strokeWidth={1.5} />
              ) : (
                <Plus width={20} height={20} color={colors.accent.default} strokeWidth={2} />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Render a core plugin slot (locked)
  const renderCoreSlot = (pluginId: string) => {
    const plugin = getPlugin(pluginId);
    if (!plugin) return null;
    const Icon = plugin.icon;

    return (
      <View
        key={pluginId}
        style={{
          width: 72,
          height: 72,
          borderRadius: 10,
          backgroundColor: colors.bg.raised,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Icon width={24} height={24} color={colors.fg.default} strokeWidth={1.5} />
        <Text style={{
          fontSize: 10,
          fontFamily: fonts.sans.medium,
          color: colors.fg.muted,
          marginTop: spacing[1],
          textAlign: 'center',
        }}>
          {plugin.name}
        </Text>
        {/* Lock badge */}
        <View style={{
          position: 'absolute',
          top: spacing[1],
          right: spacing[1],
          backgroundColor: colors.bg.raised,
          borderRadius: radius.sm,
          padding: 2,
        }}>
          <Lock width={10} height={10} color={colors.fg.subtle} strokeWidth={2} />
        </View>
      </View>
    );
  };

  // Render a customizable slot
  const renderEditableSlot = (target: SlotTarget) => {
    const pluginId = getCurrentPluginForTarget(target);
    const plugin = pluginId ? getPlugin(pluginId) : null;
    const Icon = plugin?.icon;

    const isEmpty = !plugin;

    return (
      <TouchableOpacity
        onPress={() => openPicker(target)}
        style={{
          width: 72,
          height: 72,
          borderRadius: 10,
          backgroundColor: isEmpty ? colors.bg.raised : colors.bg.raised,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        activeOpacity={0.7}
      >
        {plugin && Icon ? (
          <>
            <Icon width={24} height={24} color={colors.fg.default} strokeWidth={1.5} />
            <Text style={{
              fontSize: 10,
              fontFamily: fonts.sans.medium,
              color: colors.fg.muted,
              marginTop: spacing[1],
              textAlign: 'center',
            }}>
              {plugin.name}
            </Text>
          </>
        ) : (
          <>
            <Plus width={24} height={24} color={colors.accent.default} strokeWidth={2} />
            <Text style={{
              fontSize: 10,
              fontFamily: fonts.sans.medium,
              color: colors.accent.default,
              marginTop: spacing[1],
            }}>
              {t('bottomBar.add')}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  // Plugin picker modal
  const renderPicker = () => {
    if (!pickerTarget) return null;

    const available = getAvailablePlugins(pickerTarget);
    const currentId = getCurrentPluginForTarget(pickerTarget);

    return (
      <Modal
        visible={pickerModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: pickerBackdropOpacity,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => setPickerVisible(false)}
            />
          </Animated.View>
          <Animated.View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '75%',
            backgroundColor: colors.bg.raised,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            transform: [{ translateY: pickerSlideAnim }],
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: spacing[3],
            }}>
              <Text style={{
                fontSize: 17,
                fontFamily: fonts.sans.semibold,
                color: colors.fg.default,
              }}>
                {t('bottomBar.selectPlugin')}
              </Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <X size={24} color={colors.fg.muted} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing[3], paddingTop: 0 }} keyboardDismissMode="on-drag">
              {/* Clear option if slot has a plugin */}
              {currentId && (
                <TouchableOpacity
                  onPress={() => handleSelectPlugin(null)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing[3],
                    marginBottom: spacing[2],
                    backgroundColor: '#ef444420',
                    borderRadius: 10,
                    gap: spacing[3],
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: colors.bg.base,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <X size={22} color={'#ef4444'} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      fontFamily: fonts.sans.semibold,
                      color: '#ef4444',
                    }}>
                      {t('bottomBar.removePlugin')}
                    </Text>
                    <Text style={{
                      fontSize: 13,
                      fontFamily: fonts.sans.regular,
                      color: colors.fg.muted,
                    }}>
                      {t('bottomBar.clearSlot')}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Available plugins */}
              <Text style={{
                fontSize: 12,
                fontFamily: fonts.sans.medium,
                color: colors.fg.muted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: spacing[2],
              }}>
                {t('bottomBar.availablePlugins')}
              </Text>

              {available.length === 0 ? (
                <View style={{
                  padding: spacing[5],
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: 15,
                    fontFamily: fonts.sans.regular,
                    color: colors.fg.muted,
                    textAlign: 'center',
                  }}>
                    {t('bottomBar.allPluginsInUse')}
                  </Text>
                </View>
              ) : (
                available.map((plugin) => {
                  const Icon = plugin.icon;
                  const isCurrentlySelected = plugin.id === currentId;

                  return (
                    <TouchableOpacity
                      key={plugin.id}
                      onPress={() => handleSelectPlugin(plugin.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: spacing[3],
                        marginBottom: spacing[2],
                        backgroundColor: isCurrentlySelected ? colors.accent.default + '20' : colors.bg.raised,
                        borderRadius: 10,
                        gap: spacing[3],
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.md,
                        backgroundColor: colors.bg.base,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon
                          width={22}
                          height={22}
                          color={isCurrentlySelected ? colors.accent.default : colors.fg.default}
                          strokeWidth={isCurrentlySelected ? 2 : 1.5}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 16,
                          fontFamily: fonts.sans.semibold,
                          color: isCurrentlySelected ? colors.accent.default : colors.fg.default,
                        }}>
                          {plugin.name}
                        </Text>
                        <Text style={{
                          fontSize: 13,
                          fontFamily: fonts.sans.regular,
                          color: colors.fg.muted,
                        }}>
                          {t('bottomBar.extraPlugin')}
                        </Text>
                      </View>
                      {isCurrentlySelected && (
                        <CheckCircle2 size={24} color={colors.accent.default} strokeWidth={2} />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}

              <View style={{ height: spacing[8] }} />
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
      <Header title={t('bottomBar.title')} colors={colors} onBack={() => router.back()} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* Live Preview */}
        {renderPreview()}

        {/* Main Row Section */}
        <View style={{ paddingHorizontal: spacing[3], marginBottom: spacing[5] }}>
          <Text style={{
            fontSize: 14,
            fontFamily: fonts.sans.semibold,
            color: colors.fg.default,
            marginBottom: spacing[1],
          }}>
            {t('bottomBar.mainRow')}
          </Text>
          <Text style={{
            fontSize: 13,
            fontFamily: fonts.sans.regular,
            color: colors.fg.muted,
            marginBottom: spacing[2],
          }}>
            {t('bottomBar.mainRowDesc')}
          </Text>

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing[2],
          }}>
            {CORE_PLUGIN_IDS.map((id) => renderCoreSlot(id))}
            {renderEditableSlot({ type: 'row1' })}
          </View>
        </View>

        {/* Quick Access Row Section */}
        <View style={{ paddingHorizontal: spacing[3], marginBottom: spacing[5] }}>
          <Text style={{
            fontSize: 14,
            fontFamily: fonts.sans.semibold,
            color: colors.fg.default,
            marginBottom: spacing[1],
          }}>
            {t('bottomBar.quickAccessRow')}
          </Text>
          <Text style={{
            fontSize: 13,
            fontFamily: fonts.sans.regular,
            color: colors.fg.muted,
            marginBottom: spacing[2],
          }}>
            {t('bottomBar.quickAccessRowDesc')}
          </Text>

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing[2],
          }}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View key={index}>
                {renderEditableSlot({ type: 'row2', index })}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: spacing[8] }} />
      </ScrollView>

      {/* Plugin Picker Modal */}
      {renderPicker()}
    </View>
  );
}
