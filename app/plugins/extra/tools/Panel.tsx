import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Share,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import * as Clipboard from 'expo-clipboard';
import {
  Clipboard as ClipboardIcon,
  X,
  Copy,
  Share2,
  AlertCircle,
  Clock,
  Code,
  Lock,
  Fingerprint,
  Type,
  Minimize2,
  FileText,
  LockOpen,
  Link2,
  Unlink,
  ArrowLeftRight,
  Scissors,
  Minus,
  Calendar,
  Timer,
  Check,
} from 'lucide-react-native';
import Header, { useHeaderHeight } from "@/components/Header";
import { useTheme } from '@/contexts/ThemeContext';
import { typography } from '@/constants/themes';
import { PluginPanelProps } from '../../types';
import { gPI } from '../../gpi';
import { lunelApi } from '@/lib/storage';

const HISTORY_KEY = 'tool-history';

type ContentType = 'json' | 'xml' | 'timestamp' | 'base64' | 'url-encoded' | 'text';
type ToolCategory = 'format' | 'encode' | 'hash' | 'string' | 'time';

interface Tool {
  id: string;
  label: string;
  category: ToolCategory[];
  icon: React.ComponentType<any>;
  action: (input: string) => Promise<string>;
  placeholder?: string;
}

function ToolsPanel({ instanceId, isActive, bottomBarHeight }: PluginPanelProps) {
  const { t } = useTranslation();
  const { colors, fonts, spacing, radius } = useTheme();
  const headerHeight = useHeaderHeight();
  const { height: keyboardHeightSV } = useReanimatedKeyboardAnimation();
  const rootAnimatedStyle = useAnimatedStyle(() => ({
    marginBottom: Math.max(0, -keyboardHeightSV.value - bottomBarHeight),
  }));

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'recent'>('format');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [lastUsedTool, setLastUsedTool] = useState<string | null>(null);
  const [recentToolIds, setRecentToolIds] = useState<string[]>([]);
  const [pasteTicked, setPasteTicked] = useState(false);
  const [copyTicked, setCopyTicked] = useState(false);

  // Load recent tools on mount
  useEffect(() => {
    lunelApi.storage.jsons.read<string[]>(HISTORY_KEY).then(data => {
      if (data) setRecentToolIds(data);
    });
  }, []);

  // Save recent tool
  const addToRecent = useCallback((toolId: string) => {
    setRecentToolIds(prev => {
      const filtered = prev.filter(id => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 5);
      lunelApi.storage.jsons.write(HISTORY_KEY, updated);
      return updated;
    });
  }, []);

  // Paste from clipboard
  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setInput(text);
      setError('');
      setPasteTicked(true);
      setTimeout(() => setPasteTicked(false), 1000);
    }
  };

  // Share output
  const shareOutput = async () => {
    if (output) {
      try {
        await Share.share({ message: output });
      } catch {
        // User cancelled or error
      }
    }
  };

  // Content detection
  const detectedType = useMemo((): ContentType => {
    const trimmed = input.trim();
    if (!trimmed) return 'text';

    // JSON detection
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch {}
    }

    // XML detection
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      return 'xml';
    }

    // Unix timestamp (10 or 13 digits)
    if (/^\d{10,13}$/.test(trimmed)) {
      return 'timestamp';
    }

    // Base64 detection (basic heuristic)
    if (/^[A-Za-z0-9+/]+=*$/.test(trimmed) && trimmed.length > 20 && trimmed.length % 4 === 0) {
      return 'base64';
    }

    // URL encoded detection
    if (/%[0-9A-Fa-f]{2}/.test(trimmed)) {
      return 'url-encoded';
    }

    return 'text';
  }, [input]);

  // All tools definition
  const tools: Tool[] = useMemo(() => [
    // Format tools
    {
      id: 'json-format',
      label: t('tools.formatJson'),
      category: ['format'],
      icon: Code,
      action: async (input) => gPI.tools.formatJson(input),
      placeholder: '{"key": "value"}',
    },
    {
      id: 'json-minify',
      label: t('tools.minifyJson'),
      category: ['format'],
      icon: Minimize2,
      action: async (input) => JSON.stringify(JSON.parse(input)),
    },
    {
      id: 'xml-format',
      label: t('tools.formatXml'),
      category: ['format'],
      icon: FileText,
      action: async (input) => gPI.tools.formatXml(input),
      placeholder: '<root><item>value</item></root>',
    },
    // Encode tools
    {
      id: 'base64-encode',
      label: t('tools.base64Encode'),
      category: ['encode'],
      icon: Lock,
      action: async (input) => gPI.tools.base64Encode(input),
    },
    {
      id: 'base64-decode',
      label: t('tools.base64Decode'),
      category: ['encode'],
      icon: LockOpen,
      action: async (input) => gPI.tools.base64Decode(input),
    },
    {
      id: 'url-encode',
      label: t('tools.urlEncode'),
      category: ['encode'],
      icon: Link2,
      action: async (input) => gPI.tools.urlEncode(input),
    },
    {
      id: 'url-decode',
      label: t('tools.urlDecode'),
      category: ['encode'],
      icon: Unlink,
      action: async (input) => gPI.tools.urlDecode(input),
    },
    // Hash tools
    {
      id: 'hash-md5',
      label: t('tools.md5'),
      category: ['hash'],
      icon: Fingerprint,
      action: async (input) => gPI.tools.hash(input, 'md5'),
    },
    {
      id: 'hash-sha1',
      label: t('tools.sha1'),
      category: ['hash'],
      icon: Fingerprint,
      action: async (input) => gPI.tools.hash(input, 'sha1'),
    },
    {
      id: 'hash-sha256',
      label: t('tools.sha256'),
      category: ['hash'],
      icon: Fingerprint,
      action: async (input) => gPI.tools.hash(input, 'sha256'),
    },
    {
      id: 'hash-sha512',
      label: t('tools.sha512'),
      category: ['hash'],
      icon: Fingerprint,
      action: async (input) => gPI.tools.hash(input, 'sha512'),
    },
    // String tools
    {
      id: 'string-lower',
      label: t('tools.lowercase'),
      category: ['string'],
      icon: Type,
      action: async (input) => gPI.tools.stringOps(input, 'lowercase'),
    },
    {
      id: 'string-upper',
      label: t('tools.uppercase'),
      category: ['string'],
      icon: Type,
      action: async (input) => gPI.tools.stringOps(input, 'uppercase'),
    },
    {
      id: 'string-capitalize',
      label: t('tools.capitalize'),
      category: ['string'],
      icon: Type,
      action: async (input) => gPI.tools.stringOps(input, 'capitalize'),
    },
    {
      id: 'string-reverse',
      label: t('tools.reverse'),
      category: ['string'],
      icon: ArrowLeftRight,
      action: async (input) => gPI.tools.stringOps(input, 'reverse'),
    },
    {
      id: 'string-trim',
      label: t('tools.trim'),
      category: ['string'],
      icon: Scissors,
      action: async (input) => gPI.tools.stringOps(input, 'trim'),
    },
    {
      id: 'string-slug',
      label: t('tools.slugify'),
      category: ['string'],
      icon: Minus,
      action: async (input) => gPI.tools.stringOps(input, 'slug'),
    },
    // Time tools
    {
      id: 'time-unix-to-date',
      label: t('tools.unixToDate'),
      category: ['time'],
      icon: Calendar,
      action: async (input) => gPI.tools.unixToDate(parseInt(input)),
      placeholder: '1703548800',
    },
    {
      id: 'time-date-to-unix',
      label: t('tools.dateToUnix'),
      category: ['time'],
      icon: Clock,
      action: async (input) => (await gPI.tools.dateToUnix(input)).toString(),
      placeholder: '2024-12-26T00:00:00Z',
    },
    {
      id: 'time-now',
      label: t('tools.nowUnix'),
      category: ['time'],
      icon: Timer,
      action: async () => Math.floor(Date.now() / 1000).toString(),
    },
  ], [t]);

  // Get recent tools
  const recentTools = useMemo(() => {
    return recentToolIds
      .map(id => tools.find(t => t.id === id))
      .filter(Boolean) as Tool[];
  }, [recentToolIds, tools]);

  // Filter tools by category
  const filteredTools = useMemo(() => {
    if (activeCategory === 'recent') {
      return recentTools;
    }
    return tools.filter(t => t.category.includes(activeCategory));
  }, [activeCategory, tools, recentTools]);

  const selectedTool = useMemo(() => {
    if (!filteredTools.length) return null;
    return filteredTools.find((tool) => tool.id === selectedToolId) || filteredTools[0];
  }, [filteredTools, selectedToolId]);

  useEffect(() => {
    if (!filteredTools.length) {
      setSelectedToolId(null);
      return;
    }
    if (!filteredTools.some((tool) => tool.id === selectedToolId)) {
      setSelectedToolId(filteredTools[0].id);
    }
  }, [filteredTools, selectedToolId]);

  const runTool = useCallback(async (tool: Tool) => {
    if (!input.trim() && tool.id !== 'time-now') {
      setError(t('tools.enterInputFirst'));
      return;
    }

    try {
      const result = await tool.action(input);
      setOutput(result);
      setError('');
      setLastUsedTool(tool.id);
      addToRecent(tool.id);
    } catch (e: any) {
      setError(e.message || 'Operation failed');
      setOutput('');
    }
  }, [input, addToRecent]);

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setLastUsedTool(null);
  };

  const copyOutput = async () => {
    if (output) {
      await Clipboard.setStringAsync(output);
      setCopyTicked(true);
      setTimeout(() => setCopyTicked(false), 1000);
    }
  };

  const categories: { id: ToolCategory | 'recent'; label: string }[] = [
    ...(recentToolIds.length > 0 ? [{ id: 'recent' as const, label: t('tools.catRecent') }] : []),
    { id: 'format', label: t('tools.catFormat') },
    { id: 'encode', label: t('tools.catEncode') },
    { id: 'hash', label: t('tools.catHash') },
    { id: 'string', label: t('tools.catString') },
    { id: 'time', label: t('tools.catTime') },
  ];

  // Equal split for input/output
  const inputFlex = 1;
  const outputFlex = 1;
  const sectionLabelStyle = {
    fontSize: 14,
    fontFamily: fonts.sans.medium,
    color: colors.fg.muted,
  };
  const helperTextStyle = {
    fontSize: 14,
    fontFamily: fonts.sans.regular,
    color: colors.fg.muted,
  };
  const metaTextStyle = {
    fontSize: 14,
    fontFamily: fonts.sans.regular,
    color: colors.fg.muted,
  };

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: colors.bg.base }, rootAnimatedStyle]}>
      <Header
        title={t('nav.tools')}
        colors={colors}
      />

      {/* Category Tabs */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: spacing[3],
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border.secondary,
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={{
                paddingHorizontal: spacing[2],
                paddingTop: spacing[3],
                paddingBottom: spacing[3],
                marginRight: spacing[1],
                borderBottomWidth: 2,
                borderBottomColor: isActive ? colors.fg.muted : 'transparent',
                marginBottom: -0.5,
              }}
            >
              <Text style={{
                fontSize: typography.body,
                fontFamily: fonts.sans.regular,
                color: isActive ? colors.fg.default : colors.fg.muted,
              }}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filteredTools.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: spacing[3],
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border.secondary,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: spacing[1] }}
          >
            {filteredTools.map((tool) => {
              const isActive = selectedTool?.id === tool.id;
              return (
                <TouchableOpacity
                  key={tool.id}
                  onPress={() => setSelectedToolId(tool.id)}
                  style={{
                    paddingHorizontal: spacing[2],
                    paddingTop: spacing[2],
                    paddingBottom: spacing[2],
                    marginRight: spacing[1],
                    borderBottomWidth: 2,
                    borderBottomColor: isActive ? colors.fg.muted : 'transparent',
                    marginBottom: -0.5,
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    fontFamily: fonts.sans.medium,
                    color: isActive ? colors.fg.default : colors.fg.muted,
                  }}>
                    {tool.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Main Content Area */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing[3] }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>

        {/* Input Section */}
        <View style={{ marginBottom: spacing[3] }}>
          <View style={{
            backgroundColor: colors.bg.raised,
            borderRadius: 10,
          }}>
            <TextInput
              style={{
                minHeight: 44,
                maxHeight: 200,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[3],
                fontSize: typography.body,
                fontFamily: fonts.sans.regular,
                color: colors.fg.default,
                textAlignVertical: 'top',
                lineHeight: 22,
              } as any}
              value={input}
              onChangeText={(text) => { setInput(text); setError(''); }}
              placeholder={selectedTool?.placeholder || t('tools.inputPlaceholder')}
              placeholderTextColor={colors.fg.muted}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing[3],
              paddingBottom: spacing[2],
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                {detectedType !== 'text' && input.trim() && (
                  <Text style={{ fontSize: typography.caption, fontFamily: fonts.sans.regular, color: colors.fg.subtle }}>
                    {detectedType}
                  </Text>
                )}
                <Text style={{ fontSize: typography.caption, fontFamily: fonts.sans.regular, color: colors.fg.subtle }}>
                  {input.length} {t('tools.chars')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                {input.length > 0 && (
                  <TouchableOpacity onPress={() => { setInput(''); setError(''); }}>
                    <X size={16} color={colors.fg.muted} strokeWidth={2} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={pasteFromClipboard}>
                  {pasteTicked ? <Check size={16} color={colors.fg.muted} strokeWidth={2.5} /> : <ClipboardIcon size={16} color={colors.fg.muted} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Output Section */}
        <View style={{ marginBottom: spacing[3] }}>
          <View style={{
            backgroundColor: colors.bg.raised,
            borderRadius: 10,
          }}>
            <ScrollView
              style={{ paddingHorizontal: spacing[3], paddingTop: spacing[3], maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
            >
              {error ? (
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[2] }}>
                  <AlertCircle size={16} color={'#ef4444'} />
                  <Text style={{
                    flex: 1,
                    fontSize: typography.body,
                    fontFamily: fonts.sans.regular,
                    color: '#ef4444',
                    lineHeight: 22,
                  }}>
                    {error}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: typography.body,
                    fontFamily: fonts.sans.regular,
                    color: output ? colors.fg.default : colors.fg.muted,
                    lineHeight: 22,
                  }}
                  selectable
                >
                  {output || t('tools.resultPlaceholder')}
                </Text>
              )}
              <View style={{ height: spacing[4] }} />
            </ScrollView>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing[3],
              paddingBottom: spacing[2],
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                {lastUsedTool && output && (
                  <Text style={{ fontSize: typography.caption, fontFamily: fonts.sans.regular, color: colors.fg.subtle }}>
                    {t('tools.via')} {tools.find(tool => tool.id === lastUsedTool)?.label}
                  </Text>
                )}
                <Text style={{ fontSize: typography.caption, fontFamily: fonts.sans.regular, color: colors.fg.subtle }}>
                  {output.length} {t('tools.chars')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <TouchableOpacity onPress={copyOutput} disabled={!output} style={{ opacity: output ? 1 : 0.3 }}>
                  {copyTicked ? <Check size={16} color={colors.fg.muted} strokeWidth={2.5} /> : <Copy size={16} color={colors.fg.muted} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={shareOutput} disabled={!output} style={{ opacity: output ? 1 : 0.3 }}>
                  <Share2 size={16} color={colors.fg.muted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
      </ScrollView>

      {/* Bottom Convert Button */}
      {selectedTool && (
        <View
          style={{
            backgroundColor: colors.bg.base,
            borderTopWidth: 0.5,
            borderTopColor: colors.border.secondary,
            paddingHorizontal: spacing[3],
            paddingVertical: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => runTool(selectedTool)}
            activeOpacity={0.7}
            style={{
              height: 34,
              borderRadius: 10,
              backgroundColor: colors.accent.default,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: spacing[3],
            }}
          >
            <Text style={{
              fontSize: 13,
              fontFamily: fonts.sans.semibold,
              color: '#fff',
            }}>
              {t('tools.convert')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </Animated.View>
  );
}

export default memo(ToolsPanel);
