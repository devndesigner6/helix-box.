import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect, useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { DevsoleInfoSnapshot } from "./types";

export default function InfoSection({
  snapshot,
  listKey,
}: {
  snapshot: DevsoleInfoSnapshot | null;
  listKey: string;
}) {
  const { colors, fonts, radius } = useTheme();

  useEffect(() => {
    void listKey;
  }, [listKey]);

  const sections = useMemo(() => {
    const grouped = new Map<string, { label: string; value: string }[]>();
    (snapshot?.fields || []).forEach((field) => {
      const current = grouped.get(field.section) || [];
      current.push({ label: field.label, value: field.value });
      grouped.set(field.section, current);
    });
    return Array.from(grouped.entries());
  }, [snapshot]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
    >
      {sections.length === 0 ? (
        <View style={{ paddingTop: 48, alignItems: "center" }}>
          <Text style={{ color: colors.fg.muted, fontSize: 12, fontFamily: fonts.sans.regular }}>
            No info available
          </Text>
        </View>
      ) : null}

      {sections.map(([section, fields]) => (
        <View
          key={section}
          style={{
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border.secondary,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 7,
              backgroundColor: colors.bg.raised,
              borderBottomWidth: 1,
              borderBottomColor: colors.border.secondary,
            }}
          >
            <Text
              style={{
                color: colors.fg.muted,
                fontSize: 9,
                fontFamily: fonts.sans.semibold,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              {section}
            </Text>
          </View>

          {fields.map((field, index) => (
            <Pressable
              key={`${section}-${field.label}`}
              onLongPress={() => Clipboard.setStringAsync(field.value)}
              delayLongPress={180}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderBottomWidth: index === fields.length - 1 ? 0 : 1,
                borderBottomColor: colors.border.secondary,
                gap: 2,
              }}
            >
              <Text
                style={{
                  color: colors.fg.muted,
                  fontSize: 9,
                  fontFamily: fonts.sans.medium,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {field.label}
              </Text>
              <Text
                style={{
                  color: colors.fg.default,
                  fontSize: 11,
                  lineHeight: 16,
                  fontFamily: fonts.mono.regular,
                }}
                selectable
              >
                {field.value || "—"}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
