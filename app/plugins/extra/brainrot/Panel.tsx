import Header, { useHeaderHeight } from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { RefreshCw } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";
import { PluginPanelProps } from "../../types";

const YOUTUBE_URL = "https://m.youtube.com/shorts";
const INSTAGRAM_URL = "https://www.instagram.com/reels/";
const X_URL = "https://x.com";
const TIKTOK_URL = "https://www.tiktok.com";
const BRAINROT_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

export default function BrainrotPanel({ isActive }: PluginPanelProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { settings } = useAppSettings();
  const headerHeight = useHeaderHeight();
  const [reloadKey, setReloadKey] = useState(0);
  const webViewRef = useRef<WebViewType>(null);

  useEffect(() => {
    if (isActive) {
      webViewRef.current?.injectJavaScript(`
        document.querySelectorAll('video').forEach(function(v) { v.play(); });
        true;
      `);
    } else {
      webViewRef.current?.injectJavaScript(`
        document.querySelectorAll('video').forEach(function(v) { v.pause(); });
        true;
      `);
    }
  }, [isActive]);

  let sourceUrl = YOUTUBE_URL;

  if (settings.brainrotSource === "instagram") {
    sourceUrl = INSTAGRAM_URL;
  } else if (settings.brainrotSource === "x") {
    sourceUrl = X_URL;
  } else if (settings.brainrotSource === "tiktok") {
    sourceUrl = TIKTOK_URL;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg.base,
        },
      ]}
    >
      <Header
        title={t('nav.brainrot')}
        colors={colors}
        rightAccessory={
          <TouchableOpacity
            onPress={() => {
              setReloadKey((value) => value + 1);
            }}
            style={styles.reloadButton}
            activeOpacity={0.7}
          >
            <RefreshCw size={20} color={colors.fg.muted} strokeWidth={2} />
          </TouchableOpacity>
        }
      />
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          key={`${sourceUrl}:${reloadKey}`}
          source={{ uri: sourceUrl }}
          userAgent={BRAINROT_USER_AGENT}
          style={styles.webview}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          allowsFullscreenVideo={false}
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
          injectedJavaScriptForMainFrameOnly={false}
          injectedJavaScript={`
            (function() {
              document.addEventListener('webkitfullscreenchange', function() {
                if (document.webkitFullscreenElement) {
                  document.webkitExitFullscreen && document.webkitExitFullscreen();
                }
              }, true);
              Element.prototype.requestFullscreen = function() { return Promise.resolve(); };
              Element.prototype.webkitRequestFullscreen = function() {};
              HTMLVideoElement.prototype.webkitEnterFullscreen = function() {};
              function fixVideos() {
                document.querySelectorAll('video').forEach(function(v) {
                  v.setAttribute('playsinline', '');
                  v.removeAttribute('allowfullscreen');
                  v.requestFullscreen = function() { return Promise.resolve(); };
                  v.webkitRequestFullscreen = function() {};
                  v.webkitEnterFullscreen = function() {};
                });
              }
              fixVideos();
              new MutationObserver(fixVideos).observe(document.documentElement, { childList: true, subtree: true });
            })();
            true;
          `}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  reloadButton: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
});
