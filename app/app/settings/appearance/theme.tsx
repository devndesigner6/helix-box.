import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Header, { useHeaderHeight } from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import React from "react";
import { StyleSheet, View } from "react-native";

export default function ThemePage() {
  const { colors } = useTheme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={t('themeSettings.title')} colors={colors} onBack={() => router.back()} />

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
