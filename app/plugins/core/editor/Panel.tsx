import Loading from "@/components/Loading";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { Message, useConnection } from "@/contexts/ConnectionContext";
import { useEditorConfig } from "@/contexts/EditorContext";
import { useReviewPrompt } from "@/contexts/ReviewPromptContext";
import { useSessionRegistryActions } from "@/contexts/SessionRegistry";
import { useTheme } from "@/contexts/ThemeContext";
import { monoFamilies } from "@/constants/themes";
import { useApi } from "@/hooks/useApi";
import { logger } from "@/lib/logger";
import { usePlugins } from "@/plugins/context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { ChevronDown, ChevronUp, File, Folder, Keyboard as KeyboardIcon, Save, Search, Star, X } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { PluginPanelProps } from "../../types";
import { CODEMIRROR_WEB_BUNDLE } from "./codemirrorWebBundle";
import { registerEditorController } from "./store";

interface EditorTab {
  id: string;
  title: string;
  path: string;
  lastSavedContent: string;
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
  isDeleted: boolean;
  saveError: string | null;
  loadError: string | null;
}

const AUTOSAVE_DELAY_MS = 750;

function makeTabId() {
  return `editor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getFileName(filePath: string) {
  const segments = filePath.split("/").filter(Boolean);
  return segments[segments.length - 1] || filePath;
}

function getWebFontConfig(monoFontId: keyof typeof monoFamilies) {
  switch (monoFontId) {
    case "jetbrains-mono":
      return {
        cssFamily: '"JetBrains Mono"',
        stylesheetUrl: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
      };
    case "fira-code":
      return {
        cssFamily: '"Fira Code"',
        stylesheetUrl: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap",
      };
    case "source-code-pro":
      return {
        cssFamily: '"Source Code Pro"',
        stylesheetUrl: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;700&display=swap",
      };
    case "ibm-plex-mono":
      return {
        cssFamily: '"IBM Plex Mono"',
        stylesheetUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap",
      };
    case "dm-mono":
      return {
        cssFamily: '"DM Mono"',
        stylesheetUrl: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap",
      };
  }
}

function escapeForSingleQuotedJs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function escapeForDoubleQuotedHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function createEditorHtml({
  placeholder,
  backgroundColor,
  foregroundColor,
  placeholderColor,
  selectionColor,
  gutterBackgroundColor,
  gutterForegroundColor,
  activeLineColor,
  fontFamily,
  fontStylesheetUrl,
  fileName,
  isDark,
  wrapLines,
  fontSize,
  lineHeight,
  readOnly,
}: {
  placeholder: string;
  backgroundColor: string;
  foregroundColor: string;
  placeholderColor: string;
  selectionColor: string;
  gutterBackgroundColor: string;
  gutterForegroundColor: string;
  activeLineColor: string;
  fontFamily: string;
  fontStylesheetUrl: string;
  fileName: string;
  isDark: boolean;
  wrapLines: boolean;
  fontSize: number;
  lineHeight: number;
  readOnly: boolean;
}) {
  const editorConfig = JSON.stringify({
    placeholder,
    backgroundColor,
    foregroundColor,
    placeholderColor,
    selectionColor,
    gutterBackgroundColor,
    gutterForegroundColor,
    activeLineColor,
    fontFamily,
    fontStylesheetUrl,
    fileName,
    isDark,
    wrapLines,
    fontSize,
    lineHeight,
    readOnly,
  });

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${escapeForDoubleQuotedHtmlAttribute(fontStylesheetUrl)}" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: ${backgroundColor};
      }

      body {
        overflow: hidden;
      }

      #editor {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .cm-panels {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <div id="editor"></div>
    <script>
      ${CODEMIRROR_WEB_BUNDLE}
    </script>
    <script>
      (function () {
        var root = document.getElementById('editor');
        var config = ${editorConfig};

        function postMessage(type, value) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, value: value }));
        }

        var editor = window.__lunelCreateCodeMirrorEditor({
          parent: root,
          value: '',
          fileName: config.fileName,
          isDark: config.isDark,
          wrapLines: config.wrapLines,
          readOnly: config.readOnly,
          placeholderText: config.placeholder,
          fontFamily: config.fontFamily,
          fontSize: config.fontSize,
          lineHeight: config.lineHeight,
          backgroundColor: config.backgroundColor,
          foregroundColor: config.foregroundColor,
          caretColor: config.foregroundColor,
          selectionColor: config.selectionColor,
          gutterBackgroundColor: config.gutterBackgroundColor,
          gutterForegroundColor: config.gutterForegroundColor,
          activeLineColor: config.activeLineColor,
          onChange: function (value) {
            postMessage('change', value);
          }
        });

        window.__lunelSetValue = function (value) {
          editor.setValue(value);
        };

        window.__lunelSetFileName = function (fileName) {
          editor.setFileName(fileName);
        };

        window.__lunelSetWrapLines = function (wrapLines) {
          editor.setWrapLines(!!wrapLines);
        };

        window.__lunelSetReadOnly = function (nextReadOnly) {
          editor.setReadOnly(!!nextReadOnly);
        };

        window.__lunelOpenSearch = function () {
          editor.openSearch();
        };

        window.__lunelCloseSearch = function () {
          editor.closeSearch();
          postMessage('searchInfo', JSON.stringify({ current: 0, total: 0 }));
        };

        function postSearchInfo() {
          var info = editor.getSearchInfo();
          postMessage('searchInfo', JSON.stringify(info));
        }

        window.__lunelSetSearchQuery = function (search, replace) {
          editor.setSearchQuery(search, replace);
          postSearchInfo();
        };

        window.__lunelFindNext = function () {
          editor.findNext();
          postSearchInfo();
        };

        window.__lunelFindPrev = function () {
          editor.findPrev();
          postSearchInfo();
        };

        window.__lunelReplaceNext = function () {
          editor.replaceNext();
          postSearchInfo();
        };

        window.__lunelReplaceAll = function () {
          editor.replaceAll();
          postSearchInfo();
        };

        window.__lunelFocusEditor = function () {
          editor.focus();
        };

        window.__lunelBlurEditor = function () {
          editor.blur();
        };

        postMessage('ready', editor.getValue());
      })();
    </script>
  </body>
</html>`;
}

export default function EditorPanel({ bottomBarHeight: _bottomBarHeight }: PluginPanelProps) {
  const { t } = useTranslation();
  const { colors, fonts, fontSelection, isDark } = useTheme();
  const { fireData, onDataEvent } = useConnection();
  const { openTab, setDrawerContentVariant } = usePlugins();
  const { config } = useEditorConfig();
  const { showEditorReviewButton, requestEditorReview } = useReviewPrompt();
  const { fs } = useApi();
  const { register, unregister } = useSessionRegistryActions();
  const navigation = useNavigation();
  const extendedColors = colors as typeof colors & {
    bg?: typeof colors.bg & { overlay?: string };
    accent?: typeof colors.accent & { subtle?: string };
    editor?: { bg?: string; fg?: string };
  };
  const editorBackground = extendedColors.editor?.bg ?? colors.bg.base;
  const editorForeground = extendedColors.editor?.fg ?? colors.fg.default;
  const editorSelection = extendedColors.accent?.subtle ?? colors.bg.raised;
  const editorActiveLine = extendedColors.bg?.overlay ?? colors.bg.raised;

  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [searchMatchInfo, setSearchMatchInfo] = useState<{ current: number; total: number } | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const searchInputRef = useRef<any>(null);
  const tabsRef = useRef<EditorTab[]>([]);
  const saveTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const webViewRef = useRef<WebView | null>(null);
  const webViewContentRef = useRef<Record<string, string>>({});
  const keyboardHeightSV = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (event) => {
        "worklet";
        keyboardHeightSV.value = event.height;
      },
      onStart: (event) => {
        "worklet";
        runOnJS(setIsKeyboardVisible)(event.height > 0);
      },
      onEnd: (event) => {
        "worklet";
        keyboardHeightSV.value = event.height;
        runOnJS(setIsKeyboardVisible)(event.height > 0);
      },
    },
    []
  );

  const keyboardDismissButtonStyle = useAnimatedStyle(() => ({
    opacity: keyboardHeightSV.value > 0 ? 1 : 0,
    transform: [
      { translateY: keyboardHeightSV.value > 0 ? 0 : 12 },
    ],
  }));

  useEffect(() => {
    tabsRef.current = tabs;
  }, [tabs]);

  const clearSaveTimer = useCallback((tabId: string) => {
    const existing = saveTimeoutsRef.current[tabId];
    if (existing) {
      clearTimeout(existing);
      delete saveTimeoutsRef.current[tabId];
    }
  }, []);

  const closeTab = useCallback((tabId: string) => {
    const closingTab = tabsRef.current.find((tab) => tab.id === tabId);
    clearSaveTimer(tabId);
    delete webViewContentRef.current[tabId];
    if (closingTab) {
      fireData("editor", "close", { path: closingTab.path });
    }
    setTabs((prev) => {
      const next = prev.filter((tab) => tab.id !== tabId);
      setActiveTabId((currentActiveTabId) => {
        if (currentActiveTabId !== tabId) {
          return currentActiveTabId;
        }

        if (next.length === 0) {
          return null;
        }

        const currentIndex = prev.findIndex((tab) => tab.id === tabId);
        const nextIndex = Math.max(0, currentIndex - 1);
        return next[nextIndex]?.id ?? next[0].id;
      });
      return next;
    });
  }, [clearSaveTimer, fireData]);

  const saveTabContent = useCallback(async (tabId: string) => {
    const targetTab = tabsRef.current.find((tab) => tab.id === tabId);
    const snapshot = webViewContentRef.current[tabId] ?? targetTab?.lastSavedContent ?? "";
    if (!targetTab || targetTab.isDeleted || targetTab.isLoading || targetTab.loadError) {
      return;
    }

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? { ...tab, isSaving: true, saveError: null }
          : tab
      )
    );

    try {
      await fs.write(targetTab.path, snapshot, "utf8", undefined, { source: "editor" });
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== tabId) {
            return tab;
          }

          const latestSnapshot = webViewContentRef.current[tabId] ?? snapshot;
          return {
            ...tab,
            lastSavedContent: snapshot,
            isDirty: latestSnapshot !== snapshot,
            isSaving: false,
            saveError: null,
          };
        })
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : t('editor.failedSaveFile');
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === tabId
            ? { ...tab, isSaving: false, saveError: message, isDirty: true }
            : tab
        )
      );
    }
  }, [fs]);

  const scheduleSave = useCallback((tabId: string) => {
    clearSaveTimer(tabId);
    saveTimeoutsRef.current[tabId] = setTimeout(() => {
      delete saveTimeoutsRef.current[tabId];
      void saveTabContent(tabId);
    }, AUTOSAVE_DELAY_MS);
  }, [clearSaveTimer, saveTabContent]);

  useEffect(() => {
    if (!config.autoSave) {
      Object.values(saveTimeoutsRef.current).forEach(clearTimeout);
      saveTimeoutsRef.current = {};
      return;
    }

    for (const tab of tabsRef.current) {
      if (!tab.isDirty || tab.isDeleted || tab.isLoading || tab.loadError) {
        continue;
      }

      scheduleSave(tab.id);
    }
  }, [config.autoSave, scheduleSave]);

  const updateTabContent = useCallback((tabId: string, content: string) => {
    const currentTab = tabsRef.current.find((tab) => tab.id === tabId);
    if (!currentTab || currentTab.isDeleted || currentTab.isLoading || !!currentTab.loadError) {
      return;
    }

    const shouldScheduleSave = content !== currentTab.lastSavedContent;
    webViewContentRef.current[tabId] = content;

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== tabId) {
          return tab;
        }

        return {
          ...tab,
          isDirty: shouldScheduleSave,
          saveError: null,
        };
      })
    );

    if (shouldScheduleSave && config.autoSave) {
      scheduleSave(tabId);
    } else {
      clearSaveTimer(tabId);
    }
  }, [clearSaveTimer, config.autoSave, scheduleSave]);

  const openFile = useCallback(async (filePath: string) => {
    const existingTab = tabsRef.current.find((tab) => tab.path === filePath);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    const tabId = makeTabId();
    const nextTab: EditorTab = {
      id: tabId,
      title: getFileName(filePath),
      path: filePath,
      lastSavedContent: "",
      isDirty: false,
      isSaving: false,
      isLoading: true,
      isDeleted: false,
      saveError: null,
      loadError: null,
    };

    setTabs((prev) => [...prev, nextTab]);
    setActiveTabId(tabId);

    try {
      const stat = await fs.stat(filePath);
      if (stat.type !== "file") {
        throw new Error(t('editor.onlyFilesAllowed'));
      }
      if (stat.isBinary) {
        throw new Error(t('editor.binaryFilesNotAllowed'));
      }

      const result = await fs.read(filePath);
      if (result.encoding !== "utf8") {
        throw new Error(t('editor.binaryFilesNotAllowed'));
      }

      webViewContentRef.current[tabId] = result.content;
      fireData("editor", "open", { path: filePath });

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === tabId
            ? {
                ...tab,
                lastSavedContent: result.content,
                isLoading: false,
                loadError: null,
              }
            : tab
        )
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : t('editor.failedOpenFile');
      setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
      setActiveTabId((currentActiveTabId) => (currentActiveTabId === tabId ? null : currentActiveTabId));
      throw new Error(message);
    }
  }, [fireData, fs]);

  const insertText = useCallback(async (text: string) => {
    const activeTab = tabsRef.current.find((tab) => tab.id === activeTabId);
    if (!activeTab || activeTab.isDeleted || activeTab.isLoading || activeTab.loadError) {
      return;
    }

    const currentContent = webViewContentRef.current[activeTab.id] ?? activeTab.lastSavedContent;
    updateTabContent(activeTab.id, `${currentContent}${text}`);
  }, [activeTabId, updateTabContent]);

  const notifyFileRenamed = useCallback(async (from: string, to: string) => {
    fireData("editor", "rename", { from, to });
    setTabs((prev) =>
      prev.map((tab) =>
        tab.path === from
          ? { ...tab, path: to, title: getFileName(to) }
          : tab
      )
    );
  }, [fireData]);

  const notifyFileDeleted = useCallback(async (filePath: string) => {
    let deletedTabTitle: string | null = null;
    fireData("editor", "delete", { path: filePath });

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.path !== filePath) {
          return tab;
        }

        deletedTabTitle = tab.title;
        clearSaveTimer(tab.id);
        return {
          ...tab,
          isDeleted: true,
          isSaving: false,
          isDirty: false,
          saveError: "This file was deleted from the explorer.",
        };
      })
    );

    if (deletedTabTitle) {
      Alert.alert(t('editor.fileDeletedTitle'), t('editor.fileDeletedDesc', { title: deletedTabTitle }));
    }
  }, [clearSaveTimer, fireData]);

  const reloadTabFromDisk = useCallback(async (tabId: string, filePath: string) => {
    logger.info("editor-sync", "reloading tab from disk", { tabId, path: filePath });
    const result = await fs.read(filePath);
    if (result.encoding !== "utf8") {
      throw new Error(t('editor.binaryFilesNotAllowed'));
    }

    webViewContentRef.current[tabId] = result.content;
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              lastSavedContent: result.content,
              isDirty: false,
              isSaving: false,
              isLoading: false,
              isDeleted: false,
              saveError: null,
              loadError: null,
            }
          : tab
      )
    );

    const tab = tabsRef.current.find((candidate) => candidate.id === tabId);
    if (activeTabId === tabId && tab) {
      webViewRef.current?.injectJavaScript(`
        window.__lunelSetValue && window.__lunelSetValue('${escapeForSingleQuotedJs(result.content)}');
        window.__lunelSetFileName && window.__lunelSetFileName('${escapeForSingleQuotedJs(tab.path)}');
        window.__lunelSetWrapLines && window.__lunelSetWrapLines(${config.wrapLines ? "true" : "false"});
        window.__lunelSetReadOnly && window.__lunelSetReadOnly(${tab.isDeleted || !!tab.loadError ? "true" : "false"});
        true;
      `);
    }
  }, [activeTabId, config.wrapLines, fs]);

  const controller = useMemo(() => ({
    openFile,
    getOpenFiles: () => tabsRef.current.map((tab) => tab.path),
    getCurrentFile: () => tabsRef.current.find((tab) => tab.id === activeTabId)?.path ?? null,
    insertText,
    notifyFileRenamed,
    notifyFileDeleted,
  }), [activeTabId, insertText, notifyFileDeleted, notifyFileRenamed, openFile]);

  const reconnectRefreshTab = useCallback(async (tabId: string) => {
    const tab = tabsRef.current.find((candidate) => candidate.id === tabId);
    if (!tab) {
      return;
    }
    clearSaveTimer(tab.id);
    if (tab.isDirty) {
      setTabs((prev) =>
        prev.map((candidate) =>
          candidate.id === tab.id
            ? { ...candidate, isSaving: false, isLoading: false }
            : candidate
        )
      );
      return;
    }
    if (tab.isDeleted || tab.loadError) return;
    await reloadTabFromDisk(tab.id, tab.path);
  }, [clearSaveTimer, reloadTabFromDisk]);

  useEffect(() => {
    registerEditorController(controller);
    return () => registerEditorController(null);
  }, [controller]);

  useEffect(() => {
    register("editor", {
      sessions: tabs.map((tab) => ({
        id: tab.id,
        title: tab.isDirty ? `${tab.title} *` : tab.title,
      })),
      activeSessionId: activeTabId,
      onSessionPress: setActiveTabId,
      onSessionClose: closeTab,
      onCreateSession: () => {},
      onReconnectRefreshSession: reconnectRefreshTab,
    });
  }, [tabs, activeTabId, closeTab, register, reconnectRefreshTab]);

  useEffect(() => () => unregister("editor"), [unregister]);

  useEffect(() => {
    return () => {
      for (const tab of tabsRef.current) {
        fireData("editor", "close", { path: tab.path });
      }
      Object.values(saveTimeoutsRef.current).forEach(clearTimeout);
      saveTimeoutsRef.current = {};
    };
  }, [fireData]);

  useEffect(() => {
    setIsSearchOpen(false);
    setShowReplace(false);
    setSearchQuery("");
    setReplaceQuery("");
    setSearchMatchInfo(null);
  }, [activeTabId]);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const unsubscribe = onDataEvent((message: Message) => {
      if (message.ns !== "editor") {
        return;
      }

      logger.info("editor-sync", "received editor event", {
        action: message.action,
        path: (message.payload.path as string | undefined) ?? null,
      });

      if (message.action === "fileDeleted") {
        const filePath = message.payload.path as string | undefined;
        if (!filePath) {
          return;
        }

        void notifyFileDeleted(filePath);
        return;
      }

      if (message.action !== "fileChanged") {
        return;
      }

      const filePath = message.payload.path as string | undefined;
      if (!filePath) {
        return;
      }

      const trackedTab = tabsRef.current.find((tab) => tab.path === filePath);
      logger.info("editor-sync", "evaluating fileChanged event", {
        path: filePath,
        hasTab: !!trackedTab,
        tabId: trackedTab?.id ?? null,
        isDirty: !!trackedTab?.isDirty,
        isLoading: !!trackedTab?.isLoading,
        isDeleted: !!trackedTab?.isDeleted,
        loadError: trackedTab?.loadError ?? null,
      });
      if (!trackedTab || trackedTab.isDirty || trackedTab.isLoading || trackedTab.isDeleted || trackedTab.loadError) {
        return;
      }

      void reloadTabFromDisk(trackedTab.id, trackedTab.path).catch((error) => {
        const messageText = error instanceof Error ? error.message : t('editor.failedRefreshFile');
        logger.error("editor-sync", "failed to reload tab from disk", {
          tabId: trackedTab.id,
          path: trackedTab.path,
          error: messageText,
        });
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === trackedTab.id
              ? { ...tab, loadError: messageText }
              : tab
          )
        );
      });
    });

    return unsubscribe;
  }, [notifyFileDeleted, onDataEvent, reloadTabFromDisk]);


  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? null,
    [tabs, activeTabId]
  );
  const activeTabEditorId = activeTab?.id ?? null;
  const activeTabContent = activeTab ? (webViewContentRef.current[activeTab.id] ?? "") : "";
  const activeTabPath = activeTab?.path ?? "";
  const activeTabIsDeleted = !!activeTab?.isDeleted;
  const activeTabHasLoadError = !!activeTab?.loadError;

  const syncWebViewState = useCallback((tabId: string, content: string, readOnly: boolean, fileName: string, wrapLines: boolean) => {
    webViewRef.current?.injectJavaScript(`
      window.__lunelSetValue && window.__lunelSetValue('${escapeForSingleQuotedJs(content)}');
      window.__lunelSetFileName && window.__lunelSetFileName('${escapeForSingleQuotedJs(fileName)}');
      window.__lunelSetWrapLines && window.__lunelSetWrapLines(${wrapLines ? "true" : "false"});
      window.__lunelSetReadOnly && window.__lunelSetReadOnly(${readOnly ? "true" : "false"});
      true;
    `);
    webViewContentRef.current[tabId] = content;
  }, []);

  const handleWebViewMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data) as { type?: string; value?: string };

      if (payload.type === "searchInfo") {
        try {
          const info = JSON.parse(payload.value as string) as { current: number; total: number };
          setSearchMatchInfo(info);
        } catch {}
        return;
      }

      if (payload.type !== "change" && payload.type !== "ready") {
        return;
      }

      if (!activeTabId) {
        return;
      }

      if (payload.type === "ready") {
        const tab = tabsRef.current.find((candidate) => candidate.id === activeTabId);
        syncWebViewState(
          activeTabId,
          webViewContentRef.current[activeTabId] ?? tab?.lastSavedContent ?? "",
          !!tab?.isDeleted || !!tab?.loadError,
          tab?.path ?? "",
          config.wrapLines
        );
        return;
      }

      if (typeof payload.value !== "string") {
        return;
      }

      if (payload.type === "change") {
        updateTabContent(activeTabId, payload.value);
      }
    } catch {
      // Ignore malformed messages from the editor webview.
    }
  }, [activeTabId, config.wrapLines, syncWebViewState, updateTabContent]);

  useEffect(() => {
    if (!activeTabId || !activeTab) {
      return;
    }

    const currentWebValue = webViewContentRef.current[activeTabId];
    if (currentWebValue === activeTabContent && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        window.__lunelSetFileName && window.__lunelSetFileName('${escapeForSingleQuotedJs(activeTabPath)}');
        window.__lunelSetWrapLines && window.__lunelSetWrapLines(${config.wrapLines ? "true" : "false"});
        window.__lunelSetReadOnly && window.__lunelSetReadOnly(${activeTabIsDeleted || activeTabHasLoadError ? "true" : "false"});
        true;
      `);
      return;
    }

    syncWebViewState(activeTabId, activeTabContent, activeTabIsDeleted || activeTabHasLoadError, activeTabPath, config.wrapLines);
  }, [activeTab, activeTabContent, activeTabHasLoadError, activeTabId, activeTabIsDeleted, activeTabPath, config.wrapLines, syncWebViewState]);

  const editorHtml = useMemo(() => {
    if (!activeTabEditorId) {
      return "";
    }

    const webFont = getWebFontConfig(fontSelection.mono);

    return createEditorHtml({
      placeholder: t('editor.startTypingPlaceholder'),
      backgroundColor: editorBackground,
      foregroundColor: editorForeground,
      placeholderColor: colors.fg.subtle,
      selectionColor: editorSelection,
      gutterBackgroundColor: editorBackground,
      gutterForegroundColor: colors.fg.subtle,
      activeLineColor: editorActiveLine,
      fontFamily: `${webFont.cssFamily}, monospace`,
      fontStylesheetUrl: webFont.stylesheetUrl,
      fileName: activeTabPath,
      isDark,
      wrapLines: config.wrapLines,
      fontSize: config.fontSize,
      lineHeight: Math.round(config.fontSize * 1.5),
      readOnly: activeTabIsDeleted || activeTabHasLoadError,
    });
  }, [
    activeTabEditorId,
    activeTabHasLoadError,
    activeTabIsDeleted,
    colors.fg.subtle,
    config.fontSize,
    editorActiveLine,
    editorBackground,
    editorForeground,
    editorSelection,
    isDark,
    config.wrapLines,
    activeTabPath,
    fontSelection.mono,
  ]);

  const handleWebViewLoadEnd = useCallback(() => {
    if (!activeTabId) {
      return;
    }

    const tab = tabsRef.current.find((candidate) => candidate.id === activeTabId);
    syncWebViewState(
      activeTabId,
      webViewContentRef.current[activeTabId] ?? tab?.lastSavedContent ?? "",
      !!tab?.isDeleted || !!tab?.loadError,
      tab?.path ?? "",
      config.wrapLines
    );
  }, [activeTabId, config.wrapLines, syncWebViewState]);

  const openSearchPanel = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      window.__lunelOpenSearch && window.__lunelOpenSearch();
      true;
    `);
    setIsSearchOpen(true);
  }, []);

  const closeSearchPanel = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      window.__lunelCloseSearch && window.__lunelCloseSearch();
      true;
    `);
    setIsSearchOpen(false);
    setShowReplace(false);
    setSearchQuery("");
    setReplaceQuery("");
    setSearchMatchInfo(null);
  }, []);

  const handleSearchQueryChange = useCallback((text: string) => {
    setSearchQuery(text);
    webViewRef.current?.injectJavaScript(`
      window.__lunelSetSearchQuery && window.__lunelSetSearchQuery('${escapeForSingleQuotedJs(text)}', '${escapeForSingleQuotedJs(replaceQuery)}');
      true;
    `);
  }, [replaceQuery]);

  const handleReplaceQueryChange = useCallback((text: string) => {
    setReplaceQuery(text);
    webViewRef.current?.injectJavaScript(`
      window.__lunelSetSearchQuery && window.__lunelSetSearchQuery('${escapeForSingleQuotedJs(searchQuery)}', '${escapeForSingleQuotedJs(text)}');
      true;
    `);
  }, [searchQuery]);

  const handleFindNext = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      window.__lunelFindNext && window.__lunelFindNext();
      true;
    `);
  }, []);

  const handleFindPrev = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      window.__lunelFindPrev && window.__lunelFindPrev();
      true;
    `);
  }, []);

  const handleReplaceNext = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      window.__lunelReplaceNext && window.__lunelReplaceNext();
      true;
    `);
  }, []);

  const handleReplaceAll = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      window.__lunelReplaceAll && window.__lunelReplaceAll();
      true;
    `);
  }, []);

  const handleKeyboardButtonPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isKeyboardVisible) {
      webViewRef.current?.injectJavaScript(`
        window.__lunelBlurEditor && window.__lunelBlurEditor();
        true;
      `);
      Keyboard.dismiss();
      return;
    }

    webViewRef.current?.injectJavaScript(`
      window.__lunelFocusEditor && window.__lunelFocusEditor();
      true;
    `);
  }, [isKeyboardVisible]);

  const handleManualSave = useCallback(() => {
    if (!activeTabId) {
      return;
    }

    const tab = tabsRef.current.find((candidate) => candidate.id === activeTabId);
    if (!tab || tab.isDeleted || tab.isLoading || tab.loadError || tab.isSaving || !tab.isDirty) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearSaveTimer(activeTabId);
    void saveTabContent(activeTabId);
  }, [activeTabId, clearSaveTimer, saveTabContent]);

  const handleReviewPress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void requestEditorReview();
  }, [requestEditorReview]);

  const handleFilesButtonPress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDrawerContentVariant("default");
    navigation.dispatch(DrawerActions.closeDrawer());
    openTab("explorer");
  }, [navigation, openTab, setDrawerContentVariant]);

  const headerAccessory = useMemo(() => {
    if (!activeTab && !showEditorReviewButton) {
      return null;
    }

    return (
      <View style={styles.headerActions}>
        {showEditorReviewButton ? (
          <TouchableOpacity
            onPress={handleReviewPress}
            style={[
              styles.reviewButton,
              {
                backgroundColor: colors.accent.default,
                borderColor: colors.accent.default,
              },
            ]}
            activeOpacity={0.85}
          >
            <Star size={14} color="#ffffff" strokeWidth={2.2} />
            <Text style={[styles.reviewButtonLabel, { fontFamily: fonts.sans.medium }]}>
              Review
            </Text>
          </TouchableOpacity>
        ) : null}
        {activeTab ? (
          <>
            <TouchableOpacity
              onPress={isSearchOpen ? closeSearchPanel : openSearchPanel}
              style={styles.headerAction}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isSearchOpen
                ? <X size={22} color={colors.fg.muted} strokeWidth={2} />
                : <Search size={22} color={colors.fg.muted} strokeWidth={2} />
              }
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFilesButtonPress}
              style={styles.headerAction}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Folder size={22} color={colors.fg.muted} strokeWidth={2} />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    );
  }, [
    activeTab,
    closeSearchPanel,
    colors.accent.default,
    colors.fg.muted,
    fonts.sans.medium,
    handleFilesButtonPress,
    handleReviewPress,
    isSearchOpen,
    openSearchPanel,
    showEditorReviewButton,
  ]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg.base }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header
        title={activeTab?.title || t('nav.editor')}
        colors={colors}
        showBottomBorder={!!activeTab && !isSearchOpen}
        rightAccessoryWidth={showEditorReviewButton ? 172 : 100}
        rightAccessory={headerAccessory}
      />

      <View style={[styles.content, {  }]}>
        {isSearchOpen && (
          <View style={[styles.searchPanel, { backgroundColor: colors.bg.base, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.secondary }]}>
            <View style={styles.searchRow}>
              <TextInput
                ref={searchInputRef}
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                placeholder={t('editor.searchPlaceholder')}
                placeholderTextColor={colors.fg.subtle}
                style={[styles.searchInput, { color: colors.fg.default, backgroundColor: colors.bg.raised, fontFamily: fonts.sans.regular }]}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                onSubmitEditing={handleFindNext}
              />
              <TouchableOpacity
                onPress={handleFindPrev}
                disabled={!searchMatchInfo || searchMatchInfo.total === 0 || (searchMatchInfo.current > 0 && searchMatchInfo.current <= 1)}
                style={[styles.iconBtn, { backgroundColor: colors.bg.raised, opacity: !searchMatchInfo || searchMatchInfo.total === 0 || (searchMatchInfo.current > 0 && searchMatchInfo.current <= 1) ? 0.35 : 1 }]}
                activeOpacity={0.7}
              >
                <ChevronUp size={18} color={colors.fg.muted} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFindNext}
                disabled={!searchMatchInfo || searchMatchInfo.total === 0 || (searchMatchInfo.current > 0 && searchMatchInfo.current >= searchMatchInfo.total)}
                style={[styles.iconBtn, { backgroundColor: colors.bg.raised, opacity: !searchMatchInfo || searchMatchInfo.total === 0 || (searchMatchInfo.current > 0 && searchMatchInfo.current >= searchMatchInfo.total) ? 0.35 : 1 }]}
                activeOpacity={0.7}
              >
                <ChevronDown size={18} color={colors.fg.muted} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowReplace(v => !v)}
                style={[styles.textBtn, { backgroundColor: showReplace ? colors.accent.default : colors.bg.raised }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.textBtnLabel, { color: showReplace ? "#fff" : colors.fg.muted, fontFamily: fonts.sans.medium }]}>
                  {t('editor.replace')}
                </Text>
              </TouchableOpacity>
            </View>
            {showReplace && (
              <View style={styles.replaceRow}>
                <TextInput
                  value={replaceQuery}
                  onChangeText={handleReplaceQueryChange}
                  placeholder={t('editor.replacePlaceholder')}
                  placeholderTextColor={colors.fg.subtle}
                  style={[styles.searchInput, { color: colors.fg.default, backgroundColor: colors.bg.raised, fontFamily: fonts.sans.regular }]}
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={handleReplaceNext}
                  style={[styles.textBtn, { backgroundColor: colors.bg.raised }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.textBtnLabel, { color: colors.fg.default, fontFamily: fonts.sans.medium }]}>{t('editor.replace')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleReplaceAll}
                  style={[styles.textBtn, { backgroundColor: colors.bg.raised }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.textBtnLabel, { color: colors.fg.default, fontFamily: fonts.sans.medium }]}>{t('editor.replaceAll')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <View style={styles.editorArea}>
          {!activeTab ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
              }}
            >
              <View style={{ alignItems: "center", gap: 8 }}>
                <File size={48} color={colors.fg.muted} strokeWidth={1.5} />
                <Text style={{ color: colors.fg.muted, fontSize: 16, fontFamily: fonts.sans.regular }}>
                  {t('common.noFilesOpen')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleFilesButtonPress}
                style={{
                  alignItems: "center",
                  backgroundColor: colors.bg.raised,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: colors.fg.default,
                    fontSize: 14,
                    fontFamily: fonts.sans.medium,
                  }}
                >
                  {t('common.openExplorer')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : activeTab.isLoading ? (
            <Loading />
          ) : (
            <View style={[styles.webviewContainer, { backgroundColor: editorBackground }]}>
              <WebView
                key={activeTab.id}
                ref={webViewRef}
                source={{ html: editorHtml }}
                originWhitelist={["*"]}
                onLoadEnd={handleWebViewLoadEnd}
                onMessage={handleWebViewMessage}
                keyboardDisplayRequiresUserAction={false}
                hideKeyboardAccessoryView={true}
                scrollEnabled={false}
                overScrollMode="never"
                bounces={false}
                nestedScrollEnabled={false}
                style={[
                  styles.webview,
                  {
                    backgroundColor: editorBackground,
                    opacity: activeTab.isDeleted ? 0.6 : 1,
                  },
                ]}
              />
            </View>
          )}
        </View>
        {activeTab && (isKeyboardVisible || !config.autoSave) ? (
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.keyboardDismissOverlay,
              isKeyboardVisible ? keyboardDismissButtonStyle : null,
            ]}
          >
            {!config.autoSave ? (
              <TouchableOpacity
                onPress={handleManualSave}
                disabled={!activeTab.isDirty || activeTab.isSaving || activeTab.isDeleted || activeTab.isLoading || !!activeTab.loadError}
                style={[
                  styles.floatingActionButton,
                  {
                    backgroundColor: colors.bg.raised,
                    borderColor: colors.border.secondary,
                    opacity: !activeTab.isDirty || activeTab.isSaving || activeTab.isDeleted || activeTab.isLoading || !!activeTab.loadError ? 0.45 : 1,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Save size={20} color={colors.fg.muted} strokeWidth={2} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={handleKeyboardButtonPress}
              style={[styles.floatingActionButton, { backgroundColor: colors.bg.raised, borderColor: colors.border.secondary }]}
              activeOpacity={0.7}
            >
              <KeyboardIcon size={22} color={colors.fg.muted} strokeWidth={2} />
            </TouchableOpacity>
          </Animated.View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editorArea: {
    flex: 1,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  keyboardDismissOverlay: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  floatingActionButton: {
    borderWidth: 0.5,
    borderRadius: 999,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAction: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewButton: {
    minHeight: 34,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    marginRight: 2,
  },
  reviewButtonLabel: {
    color: "#ffffff",
    fontSize: 13,
  },
  content: {
    flex: 1,
  },
  searchPanel: {
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 10,
    gap: 8,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  replaceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  textBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textBtnLabel: {
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  emptyTitle: {
    fontSize: 17,
  },
  emptyCopy: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  openExplorerButton: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  openExplorerButtonText: {
    fontSize: 14,
  },
});
