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
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function ToggleRow({ label, description, value, onValueChange }: ToggleRowProps) {
  const { colors, fonts, spacing, typography } = useTheme();

  return (
    <View style={[styles.row, { paddingVertical: spacing[2], paddingHorizontal: spacing[3] }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular, fontSize: typography.body }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.rowDescription, { color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: typography.caption }]}>
            {description}
          </Text>
        )}
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

  const handleDecrement = () => {
    if (value > min) {
      onValueChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onValueChange(value + step);
    }
  };

  return (
    <View style={[styles.row, { paddingVertical: spacing[2], paddingHorizontal: spacing[3] }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular, fontSize: typography.body }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.rowDescription, { color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: typography.caption }]}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          onPress={handleDecrement}
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
        <Text
          style={[
            styles.stepperValue,
            { color: colors.fg.default, fontFamily: fonts.mono.medium, minWidth: 48, fontSize: typography.body },
          ]}
        >
          {value}{unit}
        </Text>
        <TouchableOpacity
          onPress={handleIncrement}
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

export default function EditorSettingsPage() {
  const { colors, fonts, spacing, typography } = useTheme();
  const { config, updateConfig } = useEditorConfig();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={t('settingsEditor.title')} colors={colors} onBack={() => router.back()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* Font Section */}
        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('settingsEditor.font')}
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 10 }]}>
          <StepperRow
            label={t('settingsEditor.fontSize')}
            description={t('settingsEditor.fontSizeDesc')}
            value={config.fontSize}
            min={10}
            max={24}
            step={1}
            unit="px"
            onValueChange={(value) => updateConfig("fontSize", value)}
          />
          <ToggleRow
            label={t('settingsEditor.wrapLines')}
            description={t('settingsEditor.wrapLinesDesc')}
            value={config.wrapLines}
            onValueChange={(value) => updateConfig("wrapLines", value)}
          />
          <ToggleRow
            label={t('settingsEditor.autoSave')}
            description={t('settingsEditor.autoSaveDesc')}
            value={config.autoSave}
            onValueChange={(value) => updateConfig("autoSave", value)}
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
  divider: {
    height: 1,
    marginHorizontal: 12,
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
