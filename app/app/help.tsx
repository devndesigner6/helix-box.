import { useTheme } from "@/contexts/ThemeContext";
import Header, { useHeaderHeight } from "@/components/Header";
import { ExternalLink } from "lucide-react-native";
import { useRouter } from "expo-router";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface FaqItemProps {
  question: string;
  answer: string;
}

interface LinkRowProps {
  label: string;
  url: string;
}

function FaqItem({ question, answer }: FaqItemProps) {
  const { colors, fonts, spacing, typography } = useTheme();

  return (
    <View style={[styles.faqCard, { backgroundColor: colors.bg.raised, borderColor: colors.bg.raised, borderRadius: 10, padding: spacing[3] }]}>
      <Text style={[styles.faqQuestion, { color: colors.fg.default, fontFamily: fonts.sans.medium, fontSize: typography.body }]}>
        {question}
      </Text>
      <Text style={[styles.faqAnswer, { color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: typography.caption }]}>
        {answer}
      </Text>
    </View>
  );
}

function LinkRow({ label, url }: LinkRowProps) {
  const { colors, fonts, spacing, typography } = useTheme();

  const handleOpen = () => {
    void WebBrowser.openBrowserAsync(url);
  };

  return (
    <TouchableOpacity
      onPress={handleOpen}
      activeOpacity={0.7}
      style={[
        styles.linkRow,
        {
          backgroundColor: colors.bg.raised,
          borderColor: colors.bg.raised,
          borderRadius: 10,
          paddingVertical: spacing[2],
          paddingHorizontal: spacing[3],
        },
      ]}
    >
      <Text style={[styles.linkLabel, { color: colors.fg.default, fontFamily: fonts.sans.medium, fontSize: typography.body }]}>
        {label}
      </Text>
      <ExternalLink size={16} color={colors.fg.subtle} strokeWidth={2} />
    </TouchableOpacity>
  );
}

export default function HelpPage() {
  const { colors, fonts, spacing, typography } = useTheme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Header title={t('help.title')} colors={colors} onBack={() => router.back()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('help.gettingStarted')}
        </Text>
        <View style={[styles.faqList, { marginHorizontal: 12 }]}>
          <FaqItem
            question={t('help.question1')}
            answer={t('help.answer1')}
          />
          <FaqItem
            question={t('help.question2')}
            answer={t('help.answer2')}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('help.troubleshooting')}
        </Text>
        <View style={[styles.faqList, { marginHorizontal: 12 }]}>
          <FaqItem
            question={t('help.question3')}
            answer={t('help.answer3')}
          />
          <FaqItem
            question={t('help.question4')}
            answer={t('help.answer4')}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: typography.caption }]}>
          {t('help.links')}
        </Text>
        <View style={[styles.linkList, { marginHorizontal: 12 }]}>
          <LinkRow label={t('help.terms')} url="https://app.lunel.dev/terms" />
          <LinkRow label={t('help.policy')} url="https://app.lunel.dev/policy" />
          <LinkRow label={t('help.security')} url="https://app.lunel.dev/security" />
          <LinkRow label={t('help.discord')} url="https://discord.gg/tdaywsP4HK" />
          <LinkRow label={t('help.github')} url="https://github.com/lunel-dev" />
          <LinkRow label={t('help.twitter')} url="https://twitter.com/uselunel" />
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
  faqList: {
    gap: 8,
  },
  faqCard: {
    borderWidth: 1,
  },
  faqQuestion: {
    marginBottom: 6,
  },
  faqAnswer: {
    lineHeight: 16,
  },
  linkList: {
    gap: 8,
  },
  linkRow: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkLabel: {},
});
