import { useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.base },
        animation: "slide_from_right",
      }}
    />
  );
}
