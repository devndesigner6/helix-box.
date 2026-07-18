import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import { Check } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, { LANGUAGE_KEY, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/i18n";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LanguagePage() {
  const { colors, fonts, spacing, radius, typography } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<SupportedLanguage>(i18n.language as SupportedLanguage);

  const handleSelect = async (lang: SupportedLanguage) => {
    setSelected(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    await i18n.changeLanguage(lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Header title={t('language.title')} colors={colors} onBack={() => router.back()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing[3] }} showsVerticalScrollIndicator={false}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selected === lang;
          return (
            <TouchableOpacity
              key={lang}
              onPress={() => handleSelect(lang)}
              activeOpacity={0.7}
              style={[
                styles.row,
                {
                  backgroundColor: isSelected ? colors.accent.default + '20' : colors.bg.raised,
                  borderRadius: 10,
                  padding: spacing[3],
                  marginBottom: spacing[2],
                },
              ]}
            >
              <Text style={{ flex: 1, fontSize: typography.body, fontFamily: fonts.sans.regular, color: colors.fg.default }}>
                {t(`language.${lang}`)}
              </Text>
              {isSelected && (
                <View style={{ width: 24, height: 24, borderRadius: radius.full, backgroundColor: colors.accent.default, alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={16} color="#ffffff" strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
});
