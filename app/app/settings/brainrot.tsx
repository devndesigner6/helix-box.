import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header, { useHeaderHeight } from "@/components/Header";
import { Check } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SourceOptionRowProps {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

function SourceOptionRow({
  label,
  description,
  selected,
  onPress,
}: SourceOptionRowProps) {
  const { colors, fonts, spacing, radius, typography } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.optionRow, { paddingVertical: spacing[2], paddingHorizontal: spacing[3] }]}
    >
      <View style={styles.optionText}>
        <Text style={[styles.optionLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular, fontSize: typography.body }]}>
          {label}
        </Text>
        <Text style={[styles.optionDescription, { color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: typography.caption }]}>
          {description}
        </Text>
      </View>
      <View
        style={[
          styles.optionIndicator,
          {
            borderRadius: radius.full,
            borderColor: selected ? colors.accent.default : colors.border.secondary,
            backgroundColor: selected ? colors.accent.default : "transparent",
          },
        ]}
      >
        {selected ? <Check size={16} color="#ffffff" strokeWidth={2.5} /> : null}
      </View>
    </TouchableOpacity>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
}: ToggleRowProps) {
  const { colors, fonts, spacing, typography } = useTheme();

  return (
    <View style={[styles.optionRow, { paddingVertical: spacing[2], paddingHorizontal: spacing[3] }]}>
      <View style={styles.optionText}>
        <Text style={[styles.optionLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular, fontSize: typography.body }]}>
          {label}
        </Text>
        <Text style={[styles.optionDescription, { color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: typography.caption }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border.main, true: colors.accent.default }}
        ios_backgroundColor={colors.border.main}
        thumbColor={value ? "#ffffff" : colors.bg.base}
      />
    </View>
  );
}

export default function BrainrotSettingsPage() {
  const { colors, fonts, spacing, typography } = useTheme();
  const { settings, updateSetting } = useAppSettings();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();
  const needsWebviewLoginNotice =
    settings.brainrotSource === "instagram"
    || settings.brainrotSource === "x"
    || settings.brainrotSource === "tiktok";

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={t('settingsBrainrot.title')} colors={colors} onBack={() => router.back()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('settingsBrainrot.source')}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 10 }]}>
          <SourceOptionRow
            label={t('settingsBrainrot.youtube')}
            description={t('settingsBrainrot.youtubeDesc')}
            selected={settings.brainrotSource === "youtube"}
            onPress={() => {
              void updateSetting("brainrotSource", "youtube");
            }}
          />
          <View style={[styles.divider, { backgroundColor: colors.border.tertiary }]} />
          <SourceOptionRow
            label={t('settingsBrainrot.instagram')}
            description={t('settingsBrainrot.instagramDesc')}
            selected={settings.brainrotSource === "instagram"}
            onPress={() => {
              void updateSetting("brainrotSource", "instagram");
            }}
          />
          <View style={[styles.divider, { backgroundColor: colors.border.tertiary }]} />
          <SourceOptionRow
            label={t('settingsBrainrot.xcom')}
            description={t('settingsBrainrot.xcomDesc')}
            selected={settings.brainrotSource === "x"}
            onPress={() => {
              void updateSetting("brainrotSource", "x");
            }}
          />
          <View style={[styles.divider, { backgroundColor: colors.border.tertiary }]} />
          <SourceOptionRow
            label={t('settingsBrainrot.tiktok')}
            description={t('settingsBrainrot.tiktokDesc')}
            selected={settings.brainrotSource === "tiktok"}
            onPress={() => {
              void updateSetting("brainrotSource", "tiktok");
            }}
          />
          {needsWebviewLoginNotice ? (
            <View
              style={[
                styles.inlineNote,
                {
                  borderTopColor: colors.border.tertiary,
                },
              ]}
            >
              <Text style={[styles.noteText, { color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: typography.caption }]}>
                {t('settingsBrainrot.webviewLogin')}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('settingsBrainrot.integration')}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 10 }]}>
          <ToggleRow
            label={t('settingsBrainrot.aiChatIntegration')}
            description={t('settingsBrainrot.aiChatIntegrationDesc')}
            value={settings.brainrotAiChatIntegration}
            onValueChange={(value) => {
              void updateSetting("brainrotAiChatIntegration", value);
            }}
          />
        </View>

        <View style={{ height: spacing[8] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  section: {
    marginHorizontal: 12,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {},
  optionDescription: { marginTop: 2 },
  optionIndicator: {
    width: 24,
    height: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
  },
  inlineNote: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  noteText: { lineHeight: 19 },
});
