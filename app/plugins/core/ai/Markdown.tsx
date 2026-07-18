import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEditorConfig } from "@/contexts/EditorContext";
import RNMarkdown from "react-native-markdown-display";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Copy, Check } from "lucide-react-native";

const AI_READING_LINE_HEIGHT = 1.45;
const AI_READING_LETTER_SPACING = 0.12;
const BOX_RADIUS = 8;

function CopyButton({
  copied,
  onCopy,
  colors,
  radius,
}: {
  copied: boolean;
  onCopy: () => void;
  colors: any;
  radius: any;
}) {
  return (
    <TouchableOpacity
      onPress={onCopy}
      style={[styles.copyButton, { backgroundColor: colors.bg.raised, borderRadius: radius.sm }]}
      activeOpacity={0.7}
    >
      {copied ? (
        <Check size={12} color={colors.fg.muted} strokeWidth={2} />
      ) : (
        <Copy size={12} color={colors.fg.muted} strokeWidth={2} />
      )}
    </TouchableOpacity>
  );
}

export default function Markdown({ children, compact = false }: { children: string; compact?: boolean }) {
  const { colors, radius, fonts } = useTheme();
  const { config } = useEditorConfig();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyFontSize = compact ? 13 : config.aiFontSize;
  const bodyLineHeight = compact ? 19 : Math.round(config.aiFontSize * AI_READING_LINE_HEIGHT);
  const headingScale = compact ? 0.9 : 1;

  useEffect(() => () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
  }, []);

  const handleCopy = useCallback(async (id: string, text: string) => {
    await Clipboard.setStringAsync(text);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    setCopiedId(id);
    resetTimerRef.current = setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1000);
  }, []);

  const makeCopyId = useCallback((prefix: string, content: string) => {
    const head = content.slice(0, 48);
    return `${prefix}:${content.length}:${head}`;
  }, []);

  const markdownStyles = useMemo(
    () => ({
      body: {
        color: colors.fg.default,
        fontSize: bodyFontSize,
        lineHeight: bodyLineHeight,
        letterSpacing: AI_READING_LETTER_SPACING,
        fontFamily: fonts.sans.regular,
      },
      heading1: {
        color: colors.fg.default,
        fontSize: 20 * headingScale,
        fontFamily: fonts.sans.bold,
        marginTop: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.bg.raised,
        paddingBottom: 6,
      },
      heading2: {
        color: colors.fg.default,
        fontSize: 17 * headingScale,
        fontFamily: fonts.sans.bold,
        marginTop: 14,
        marginBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: colors.bg.raised,
        paddingBottom: 4,
      },
      heading3: {
        color: colors.fg.default,
        fontSize: 15 * headingScale,
        fontFamily: fonts.sans.semibold,
        marginTop: 12,
        marginBottom: 4,
      },
      heading4: {
        color: colors.fg.default,
        fontSize: 14 * headingScale,
        fontFamily: fonts.sans.semibold,
        marginTop: 10,
        marginBottom: 4,
      },
      heading5: {
        color: colors.fg.muted,
        fontSize: 13 * headingScale,
        fontFamily: fonts.sans.semibold,
        marginTop: 8,
        marginBottom: 4,
      },
      heading6: {
        color: colors.fg.muted,
        fontSize: 12 * headingScale,
        fontFamily: fonts.sans.semibold,
        marginTop: 8,
        marginBottom: 4,
      },
      paragraph: {
        marginTop: 0,
        marginBottom: 8,
      },
      strong: {
        fontFamily: fonts.sans.bold,
        fontWeight: undefined as any,
      },
      em: {
        fontStyle: "italic" as const,
      },
      s: {
        textDecorationLine: "line-through" as const,
      },
      link: {
        color: colors.accent.default,
        textDecorationLine: "underline" as const,
      },
      blockquote: {
        backgroundColor: colors.bg.raised,
        borderLeftWidth: 3,
        borderLeftColor: colors.accent.default,
        paddingLeft: 12,
        paddingVertical: 6,
        marginVertical: 6,
      },
      code_inline: {
        backgroundColor: colors.bg.raised,
        color: colors.fg.default,
        fontFamily: fonts.mono.regular,
        fontSize: 12,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: BOX_RADIUS,
      },
      code_block: {
        backgroundColor: colors.bg.raised,
        color: colors.fg.default,
        fontFamily: fonts.mono.regular,
        fontSize: 12,
        lineHeight: 18,
        padding: 12,
        borderRadius: BOX_RADIUS,
        borderWidth: 1,
        borderColor: colors.bg.raised,
        marginVertical: 6,
      },
      fence: {
        backgroundColor: colors.bg.raised,
        color: colors.fg.default,
        fontFamily: fonts.mono.regular,
        fontSize: 12,
        lineHeight: 18,
        padding: 12,
        borderRadius: BOX_RADIUS,
        borderWidth: 1,
        borderColor: colors.bg.raised,
        marginVertical: 6,
      },
      bullet_list: {
        marginVertical: 4,
      },
      ordered_list: {
        marginVertical: 4,
      },
      list_item: {
        marginVertical: 2,
        flexDirection: "row" as const,
      },
      bullet_list_icon: {
        color: colors.fg.muted,
        fontSize: bodyFontSize,
        marginRight: 8,
        lineHeight: bodyLineHeight,
        letterSpacing: AI_READING_LETTER_SPACING,
      },
      ordered_list_icon: {
        color: colors.fg.muted,
        fontSize: bodyFontSize,
        marginRight: 8,
        lineHeight: bodyLineHeight,
        letterSpacing: AI_READING_LETTER_SPACING,
        fontFamily: fonts.mono.regular,
      },
      table: {
        borderWidth: 1,
        borderColor: colors.bg.raised,
        borderRadius: radius.sm,
        marginVertical: 6,
      },
      thead: {
        backgroundColor: colors.bg.raised,
      },
      th: {
        padding: 8,
        borderBottomWidth: 1,
        borderColor: colors.bg.raised,
      },
      td: {
        padding: 8,
        borderBottomWidth: 1,
        borderColor: colors.bg.raised,
      },
      tr: {
        borderBottomWidth: 1,
        borderColor: colors.bg.raised,
      },
      hr: {
        backgroundColor: colors.bg.raised,
        height: 1,
        marginVertical: 12,
      },
      image: {
        borderRadius: radius.sm,
      },
    }),
    [colors, radius, fonts, bodyFontSize, bodyLineHeight, headingScale]
  );

  const rules = useMemo(
    () => ({
      fence: (
        node: any,
        _children: any,
        _parent: any,
        mdStyles: any,
      ) => {
        const code = node.content || "";
        const lang = node.sourceInfo || "";
        const copyId = makeCopyId(`fence:${lang || "plain"}`, code);
        return (
          <View
            key={node.key}
            style={[
              styles.codeBlockContainer,
              {
                backgroundColor: colors.bg.raised,
                borderRadius: BOX_RADIUS,
                borderWidth: 1,
                borderColor: colors.bg.raised,
                marginVertical: 6,
              },
            ]}
          >
            {/* Language label + copy button */}
            <View style={[styles.codeBlockHeader, { borderBottomColor: colors.bg.raised }]}>
              {lang ? (
                <Text
                  style={{
                    color: colors.fg.subtle,
                    fontSize: 10,
                    fontFamily: fonts.mono.regular,
                    textTransform: "uppercase",
                  }}
                >
                  {lang}
                </Text>
              ) : (
                <View />
              )}
              <CopyButton
                copied={copiedId === copyId}
                onCopy={() => { void handleCopy(copyId, code); }}
                colors={colors}
                radius={radius}
              />
            </View>
            {/* Code content */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
              <Text
                style={{
                  color: colors.fg.default,
                  fontFamily: fonts.mono.regular,
                  fontSize: 12,
                  lineHeight: 18,
                  padding: 12,
                  minWidth: "100%" as any,
                }}
                selectable
              >
                {code}
              </Text>
            </ScrollView>
          </View>
        );
      },
      code_block: (
        node: any,
        _children: any,
        _parent: any,
        mdStyles: any,
      ) => {
        const code = node.content || "";
        const copyId = makeCopyId("code_block", code);
        return (
          <View
            key={node.key}
            style={[
              styles.codeBlockContainer,
              {
                backgroundColor: colors.bg.raised,
                borderRadius: BOX_RADIUS,
                borderWidth: 1,
                borderColor: colors.bg.raised,
                marginVertical: 6,
              },
            ]}
          >
            <View style={[styles.codeBlockHeader, { borderBottomColor: colors.bg.raised }]}>
              <View />
              <CopyButton
                copied={copiedId === copyId}
                onCopy={() => { void handleCopy(copyId, code); }}
                colors={colors}
                radius={radius}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
              <Text
                style={{
                  color: colors.fg.default,
                  fontFamily: fonts.mono.regular,
                  fontSize: 12,
                  lineHeight: 18,
                  padding: 12,
                  minWidth: "100%" as any,
                }}
                selectable
              >
                {code}
              </Text>
            </ScrollView>
          </View>
        );
      },
    }),
    [colors, radius, fonts, copiedId, handleCopy, makeCopyId]
  );

  if (!children || children.trim() === "") return null;

  return (
    <RNMarkdown style={markdownStyles} rules={rules} mergeStyle>
      {children}
    </RNMarkdown>
  );
}

const styles = StyleSheet.create({
  copyButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  codeBlockContainer: {
    overflow: "hidden",
  },
  codeBlockHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
});
