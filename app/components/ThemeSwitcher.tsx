import {
  ThemeOption,
  themes,
} from "@/constants/themes";
import { useTheme } from "@/contexts/ThemeContext";
import { Check } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface ThemeCardData {
  id: ThemeOption;
  previewColors: string[];
}

const THEME_OPTIONS: ThemeOption[] = ["system", "light", "dark"];

export function ThemeSwitcher() {
  const { selectedTheme, setTheme, colors, fonts, radius, spacing, typography } = useTheme();
  const { t } = useTranslation();

  const themeOptions: ThemeCardData[] = THEME_OPTIONS.map((id) => {
    const resolvedId = id === "system" ? "dark" : id;
    const theme = themes[resolvedId];
    const previewColors = [
      theme.accent.default,
      theme.fg.default,
      theme.terminal.blue,
      theme.terminal.green,
    ];

    return { id, previewColors };
  });

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg.base, flex: 1 }}
      contentContainerStyle={{ padding: spacing[3] }}
    >
      {themeOptions.map((theme) => {
        const isSelected = selectedTheme === theme.id;

        return (
          <TouchableOpacity
            key={theme.id}
            onPress={() => setTheme(theme.id)}
            activeOpacity={0.7}
            style={{
              backgroundColor: isSelected ? colors.accent.default + '20' : colors.bg.raised,
              borderRadius: 10,
              padding: spacing[3],
              marginBottom: spacing[2],
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.fg.default,
                    fontSize: typography.body,
                    fontFamily: fonts.sans.medium,
                    marginBottom: spacing[1],
                  }}
                >
                  {t(`themeSettings.${theme.id}`)}
                </Text>

                <Text
                  style={{
                    color: colors.fg.muted,
                    fontSize: typography.caption,
                    fontFamily: fonts.sans.regular,
                    lineHeight: 16,
                  }}
                >
                  {t(`themeSettings.${theme.id}Desc`)}
                </Text>
              </View>

              {isSelected && (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: radius.full,
                    backgroundColor: colors.accent.default,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: spacing[2],
                  }}
                >
                  <Check size={16} color={'#ffffff'} strokeWidth={3} />
                </View>
              )}
            </View>

            {/* Color preview */}
            <View style={{ flexDirection: "row", gap: spacing[1], marginTop: spacing[2] }}>
              {theme.previewColors.map((color, index) => (
                <View
                  key={index}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: radius.full,
                    backgroundColor: color,
                    borderWidth: 1,
                    borderColor: colors.fg.subtle,
                  }}
                />
              ))}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
