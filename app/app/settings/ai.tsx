import { useEditorConfig } from "@/contexts/EditorContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header, { useHeaderHeight } from "@/components/Header";
import { Minus, Plus } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface StepperRowProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onValueChange: (value: number) => void;
}

function StepperRow({ label, description, value, min, max, step = 1, unit = "", onValueChange }: StepperRowProps) {
  const { colors, fonts, spacing, radius, typography } = useTheme();

  return (
    <View style={[styles.row, { paddingVertical: spacing[2], paddingHorizontal: spacing[3] }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular, fontSize: typography.body }]}>
          {label}
        </Text>
        {description ? (
          <Text style={[styles.rowDescription, { color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: typography.caption }]}>
            {description}
          </Text>
        ) : null}
      </View>
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          onPress={() => value > min && onValueChange(value - step)}
          disabled={value <= min}
          style={[
            styles.stepperButton,
            {
              backgroundColor: colors.bg.raised,
              borderRadius: radius.md,
              opacity: value <= min ? 0.4 : 1,
            },
          ]}
        >
          <Minus size={18} color={colors.fg.default} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.stepperValue, { color: colors.fg.default, fontFamily: fonts.mono.medium, minWidth: 52, fontSize: typography.body }]}>
          {value}{unit}
        </Text>
        <TouchableOpacity
          onPress={() => value < max && onValueChange(value + step)}
          disabled={value >= max}
          style={[
            styles.stepperButton,
            {
              backgroundColor: colors.bg.raised,
              borderRadius: radius.md,
              opacity: value >= max ? 0.4 : 1,
            },
          ]}
        >
          <Plus size={18} color={colors.fg.default} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AISettingsPage() {
  const { colors, fonts, spacing, typography } = useTheme();
  const { config, updateConfig } = useEditorConfig();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={t('settingsAI.title')} colors={colors} onBack={() => router.back()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('settingsAI.chat')}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 10 }]}>
          <StepperRow
            label={t('settingsAI.aiFontSize')}
            description={t('settingsAI.aiFontSizeDesc')}
            value={config.aiFontSize}
            min={13}
            max={20}
            step={1}
            unit="px"
            onValueChange={(value) => updateConfig("aiFontSize", value)}
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  rowLabel: {},
  rowDescription: {
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepperButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: { textAlign: "center" },
});
