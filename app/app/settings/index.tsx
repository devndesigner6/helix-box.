import { useTheme } from "@/contexts/ThemeContext";
import Header, { useHeaderHeight } from "@/components/Header";
import { ChevronRight, LucideIcon, Palette, Type, Code, Sparkles, MoonStar, Shell, Globe } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SettingsRowProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

function SettingsRow({ icon: Icon, label, onPress }: SettingsRowProps) {
  const { colors, fonts, radius, spacing, typography } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingsRow, { paddingVertical: spacing[2], paddingHorizontal: spacing[3] }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.accent.default + '20', borderRadius: radius.md }]}>
          <Icon size={18} color={colors.accent.default} strokeWidth={2} />
        </View>
        <Text style={[styles.rowLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular, fontSize: typography.body }]}>
          {label}
        </Text>
      </View>
      <ChevronRight size={20} color={colors.fg.subtle} strokeWidth={2} />
    </TouchableOpacity>
  );
}

export default function SettingsPage() {
  const { colors, fonts, radius, spacing, typography } = useTheme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Header title={t('settings.title')} colors={colors} onBack={() => router.back()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* Appearance Section */}
        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('settings.appearance')}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 10 }]}>
          <SettingsRow
            icon={Palette}
            label={t('settings.theme')}
            onPress={() => router.push("/settings/appearance/theme")}
          />
          <View style={[styles.divider, { backgroundColor: colors.border.tertiary }]} />
          <SettingsRow
            icon={Type}
            label={t('settings.fonts')}
            onPress={() => router.push("/settings/appearance/fonts")}
          />
          {/* <View style={[styles.divider, { backgroundColor: colors.border.tertiary }]} />
          <SettingsRow
            icon={Grid3x3}
            label="Customize Bottom Bar"
            onPress={() => router.push("/settings/bottom-bar")}
          /> */}
        </View>

        {/* Editor Section */}
        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('settings.editor')}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 10 }]}>
          <SettingsRow
            icon={Code}
            label={t('settings.editorSettings')}
            onPress={() => router.push("/settings/editor")}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('settings.app')}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 10 }]}>
          <SettingsRow
            icon={MoonStar}
            label={t('settings.appSettings')}
            onPress={() => router.push("/settings/app")}
          />
          <View style={[styles.divider, { backgroundColor: colors.border.tertiary }]} />
          <SettingsRow
            icon={Shell}
            label={t('settings.brainrot')}
            onPress={() => router.push("/settings/brainrot")}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('settings.ai')}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 10 }]}>
          <SettingsRow
            icon={Sparkles}
            label={t('settings.aiSettings')}
            onPress={() => router.push("/settings/ai")}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('settings.language')}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 10 }]}>
          <SettingsRow
            icon={Globe}
            label={t('settings.languageOption')}
            onPress={() => router.push("/settings/language")}
          />
        </View>

        {/* Bottom padding */}
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
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {},
  divider: {
    height: 1,
    marginHorizontal: 12,
  },
});
