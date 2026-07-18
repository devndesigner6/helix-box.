import { useTheme } from "@/contexts/ThemeContext";
import Header, { useHeaderHeight } from "@/components/Header";
import {
  MonoFamilyId,
  monoFamilies,
} from "@/constants/themes";
import { Check, Info } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

import React from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FontOptionProps {
  name: string;
  sampleText: string;
  fontFamily: string;
  isSelected: boolean;
  onSelect: () => void;
}

function FontOption({ name, sampleText, fontFamily, isSelected, onSelect }: FontOptionProps) {
  const { colors, fonts, spacing, radius, typography } = useTheme();

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[
        styles.fontOption,
        {
          backgroundColor: isSelected ? colors.accent.default + '20' : colors.bg.raised,
          borderRadius: 10,
          padding: spacing[3],
          marginBottom: spacing[2],
        },
      ]}
    >
      <View style={styles.fontOptionHeader}>
        <Text
          style={{
            fontSize: typography.body,
            fontFamily: fonts.sans.medium,
            color: isSelected ? colors.accent.default : colors.fg.default,
          }}
        >
          {name}
        </Text>
        {isSelected && (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: radius.full,
              backgroundColor: colors.accent.default,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={16} color={'#ffffff'} strokeWidth={3} />
          </View>
        )}
      </View>
      <Text
        style={{
          fontSize: typography.caption,
          fontFamily: fontFamily,
          color: colors.fg.muted,
          marginTop: spacing[2],
        }}
      >
        {sampleText}
      </Text>
    </TouchableOpacity>
  );
}

export default function CodeFontPage() {
  const {
    colors,
    fonts,
    spacing,
    radius,
    fontSelection,
    setMonoFont,
  } = useTheme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();

  const monoFontIds = Object.keys(monoFamilies) as MonoFamilyId[];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title={t('fontCode.title')}
        colors={colors}
        onBack={() => router.back()}
        rightAccessory={(
          <TouchableOpacity
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                t('fontCode.alertTitle'),
                t('fontCode.alertMessage')
              );
            }}
            style={{ padding: 8 }}
            activeOpacity={0.7}
          >
            <Info size={18} color={colors.fg.muted} strokeWidth={2} />
          </TouchableOpacity>
        )}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: spacing[3] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: spacing[3] }}>
          {monoFontIds.map((id) => {
            const family = monoFamilies[id];
            return (
              <FontOption
                key={id}
                name={family.name}
                sampleText={t('fontCode.sampleText')}
                fontFamily={family.regular}
                isSelected={fontSelection.mono === id}
                onSelect={() => setMonoFont(id)}
              />
            );
          })}
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
  fontOption: {
    flexDirection: "column",
  },
  fontOptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
