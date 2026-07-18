import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import type { AIPart } from "./types";
import { classifyDiffLine, looksLikeDiff, parseDiffChunks } from "./diff";

const DIFF_ADD_COLOR = "#23824d";
const DIFF_DELETE_COLOR = "#b13a3a";
const BOX_RADIUS = 8;

function InlineChevronIcon({ size = 14, color = "currentColor", expanded = false }: { size?: number; color?: string; expanded?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={expanded ? { transform: [{ rotate: "90deg" }] } : undefined}>
      <Path d="m9 6l6 6l-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function formatFileChangeOutput(output: unknown): string | null {
  if (!output) return null;
  if (typeof output === "string") return output;
  const str = JSON.stringify(output, null, 2);
  return str.trim() ? str : null;
}

function extractStatus(outputText: string): string | null {
  const match = outputText.match(/^Status:\s*(.+)$/m);
  return match?.[1]?.trim() || null;
}

function formatActionLabel(action: string) {
  return action.charAt(0).toUpperCase() + action.slice(1);
}

export default function FileChange({
  part,
  colors,
  fonts,
  radius,
}: {
  part: AIPart;
  colors: any;
  fonts: any;
  radius: any;
}) {
  const outputText = formatFileChangeOutput(part.output);
  const chunks = useMemo(
    () => (looksLikeDiff(outputText) ? parseDiffChunks(outputText) : []),
    [outputText]
  );
  const [expanded, setExpanded] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(chunks.map((chunk) => chunk.id)));
  const summary = useMemo(() => {
    const files = chunks.length;
    const additions = chunks.reduce((sum, chunk) => sum + chunk.additions, 0);
    const deletions = chunks.reduce((sum, chunk) => sum + chunk.deletions, 0);
    const status = outputText ? extractStatus(outputText) : null;
    return { files, additions, deletions, status };
  }, [chunks, outputText]);

  useEffect(() => {
    setExpandedIds(new Set(chunks.map((chunk) => chunk.id)));
  }, [chunks]);

  if (!outputText) return null;

  if (chunks.length === 0) {
    return (
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: colors.bg.raised,
            borderColor: colors.bg.raised,
            borderRadius: BOX_RADIUS,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setExpanded((value) => !value)}
          activeOpacity={0.7}
          style={styles.blockHeader}
        >
          <View style={styles.blockHeaderLeft}>
            <InlineChevronIcon size={14} color={colors.fg.muted} expanded={expanded} />
            <Text style={{ color: colors.fg.default, fontSize: 12, fontFamily: fonts.sans.medium }}>
              File changes
            </Text>
          </View>
          {summary.status ? (
            <View style={styles.headerMetaRow}>
              <Text style={{ color: colors.fg.muted, fontSize: 10, fontFamily: fonts.mono.regular }}>
                {summary.status}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
        {expanded ? (
          <Text
            selectable
            style={[
              styles.fallbackText,
              {
                color: colors.fg.muted,
                fontFamily: fonts.mono.regular,
                backgroundColor: colors.bg.raised,
                borderColor: colors.bg.raised,
                borderRadius: BOX_RADIUS,
              },
            ]}
          >
            {outputText}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.bg.raised,
          borderColor: colors.bg.raised,
          borderRadius: BOX_RADIUS,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => setExpanded((value) => !value)}
        activeOpacity={0.7}
        style={styles.blockHeader}
      >
        <View style={styles.blockHeaderLeft}>
          <InlineChevronIcon size={14} color={colors.fg.muted} expanded={expanded} />
          <Text style={{ color: colors.fg.default, fontSize: 12, fontFamily: fonts.sans.medium }}>
            File changes
          </Text>
        </View>
        <View style={styles.blockSummary}>
          <Text style={{ color: colors.fg.muted, fontSize: 10, fontFamily: fonts.mono.regular }}>
            {summary.files} {summary.files === 1 ? "file" : "files"}
          </Text>
          <Text style={{ color: DIFF_ADD_COLOR, fontSize: 10, fontFamily: fonts.mono.regular }}>
            +{summary.additions}
          </Text>
          <Text style={{ color: DIFF_DELETE_COLOR, fontSize: 10, fontFamily: fonts.mono.regular }}>
            -{summary.deletions}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded ? chunks.map((chunk) => {
        const expanded = expandedIds.has(chunk.id);
        const actionColor = chunk.action === "added"
          ? '#22c55e'
          : chunk.action === "deleted"
            ? '#ef4444'
            : chunk.action === "renamed"
              ? colors.accent.default
              : colors.fg.default;

        return (
          <View
            key={chunk.id}
            style={[
              styles.diffCard,
              {
                backgroundColor: colors.bg.base,
                borderRadius: BOX_RADIUS,
                borderColor: colors.bg.raised,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setExpandedIds((prev) => {
                  const next = new Set(prev);
                  if (next.has(chunk.id)) next.delete(chunk.id);
                  else next.add(chunk.id);
                  return next;
                });
              }}
              activeOpacity={0.7}
              style={styles.diffCardHeader}
            >
              <View style={styles.diffCardTitleRow}>
                <InlineChevronIcon size={14} color={colors.fg.muted} expanded={expanded} />
                <Text
                  numberOfLines={1}
                  style={{ flex: 1, color: colors.fg.default, fontSize: 12, fontFamily: fonts.mono.regular }}
                >
                  {chunk.path}
                </Text>
              </View>
              <View style={styles.diffTotals}>
                <Text style={{ color: actionColor, fontSize: 10, fontFamily: fonts.sans.medium }}>
                  {formatActionLabel(chunk.action)}
                </Text>
                {chunk.additions > 0 ? (
                  <Text style={{ color: DIFF_ADD_COLOR, fontSize: 10, fontFamily: fonts.mono.regular }}>
                    +{chunk.additions}
                  </Text>
                ) : null}
                {chunk.deletions > 0 ? (
                  <Text style={{ color: DIFF_DELETE_COLOR, fontSize: 10, fontFamily: fonts.mono.regular }}>
                    -{chunk.deletions}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>

            {expanded ? (
              <View style={[styles.diffCodeWrap, { borderTopColor: colors.bg.raised, backgroundColor: colors.bg.base }]}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  style={{ backgroundColor: colors.bg.base }}
                  contentContainerStyle={[styles.diffScrollContent, { backgroundColor: colors.bg.base }]}
                >
                  <View style={[styles.diffCodeContent, { backgroundColor: colors.bg.base }]}>
                    {chunk.diffCode.split("\n").map((line, index) => {
                      const kind = classifyDiffLine(line);
                      const textColor = kind === "addition"
                        ? DIFF_ADD_COLOR
                        : kind === "deletion"
                          ? DIFF_DELETE_COLOR
                          : kind === "hunk"
                            ? colors.fg.subtle
                            : kind === "meta"
                              ? colors.fg.muted
                              : colors.fg.default;
                      const backgroundColor = kind === "addition"
                        ? `${'#22c55e'}1A`
                        : kind === "deletion"
                          ? `${'#ef4444'}1A`
                          : colors.bg.base;

                      if (kind === "meta") {
                        return null;
                      }

                      return (
                        <View
                          key={`${chunk.id}:${index}`}
                          style={[styles.diffLineRow, { backgroundColor }]}
                        >
                          <View
                            style={[
                              styles.diffIndicator,
                              {
                                backgroundColor: kind === "addition"
                                  ? DIFF_ADD_COLOR
                                  : kind === "deletion"
                                    ? DIFF_DELETE_COLOR
                                    : "transparent",
                              },
                            ]}
                          />
                          <Text
                            selectable
                            style={{ color: textColor, fontSize: 11, fontFamily: fonts.mono.regular, lineHeight: 16, paddingHorizontal: 10, paddingVertical: 1 }}
                          >
                            {line || " "}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            ) : null}
          </View>
        );
      }) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
    overflow: "hidden",
  },
  fallbackText: {
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  diffCard: {
    borderWidth: 1,
    overflow: "hidden",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  blockHeader: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  headerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  blockHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  blockSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  diffCardHeader: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  diffCardTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  diffTotals: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  diffCodeWrap: {
    borderTopWidth: 1,
    paddingVertical: 6,
  },
  diffScrollContent: {
    minWidth: "100%",
  },
  diffCodeContent: {
    alignSelf: "flex-start",
    minWidth: "100%",
  },
  diffLineRow: {
    flexDirection: "row",
    alignItems: "stretch",
    alignSelf: "flex-start",
  },
  diffIndicator: {
    width: 2,
  },
});
