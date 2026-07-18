import {
  buildFonts,
  DEFAULT_FONT_SELECTION,
  DisplayFamilyId,
  NormalFamilyId,
  FontSelection,
  isDarkTheme,
  isValidTheme,
  MonoFamilyId,
  normalizeFontSelection,
  radius,
  spacing,
  ThemeColors,
  ThemeFonts,
  ThemeId,
  ThemeOption,
  ThemeRadius,
  themes,
  ThemeSpacing,
  typography,
  ThemeTypography,
} from "@/constants/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

const THEME_STORAGE_KEY = "@lunel_theme";
const FONTS_STORAGE_KEY = "@lunel_fonts";

interface ThemeContextType {
  // Theme selection
  selectedTheme: ThemeOption;
  themeId: ThemeId;
  setTheme: (theme: ThemeOption) => Promise<void>;

  // Theme colors (new layered system)
  colors: ThemeColors;

  // Design tokens
  fonts: ThemeFonts;
  radius: ThemeRadius;
  spacing: ThemeSpacing;
  typography: ThemeTypography;

  // Font selection
  fontSelection: FontSelection;
  setNormalFont: (fontId: NormalFamilyId) => Promise<void>;
  setMonoFont: (fontId: MonoFamilyId) => Promise<void>;
  setDisplayFont: (fontId: DisplayFamilyId) => Promise<void>;

  // Helpers
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
let hasLoggedMissingThemeProvider = false;

const fallbackThemeContext: ThemeContextType = {
  selectedTheme: "system",
  themeId: "light",
  setTheme: async () => {},
  colors: themes.light,
  fonts: buildFonts(DEFAULT_FONT_SELECTION),
  radius,
  spacing,
  typography,
  fontSelection: DEFAULT_FONT_SELECTION,
  setNormalFont: async () => {},
  setMonoFont: async () => {},
  setDisplayFont: async () => {},
  isDark: false,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceColorScheme = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>("system");
  const [fontSelection, setFontSelection] = useState<FontSelection>(DEFAULT_FONT_SELECTION);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedTheme, savedFonts] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(FONTS_STORAGE_KEY),
      ]);

      if (savedTheme && isValidTheme(savedTheme)) {
        setSelectedTheme(savedTheme);
      }
      // No saved theme → stays "system" (the default)

      if (savedFonts) {
        try {
          const parsed = JSON.parse(savedFonts);
          const normalized = normalizeFontSelection(parsed);
          setFontSelection(normalized);
          if (
            normalized.normal !== parsed.normal
            || normalized.mono !== parsed.mono
            || normalized.display !== parsed.display
          ) {
            await AsyncStorage.setItem(FONTS_STORAGE_KEY, JSON.stringify(normalized));
          }
        } catch (e) {
          console.warn("Failed to parse saved fonts:", e);
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (theme: ThemeOption) => {
    try {
      setSelectedTheme(theme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const saveFontSelection = async (selection: FontSelection) => {
    try {
      setFontSelection(selection);
      await AsyncStorage.setItem(FONTS_STORAGE_KEY, JSON.stringify(selection));
    } catch (error) {
      console.error("Failed to save fonts:", error);
    }
  };

  const setNormalFont = async (fontId: NormalFamilyId) => {
    await saveFontSelection({ ...fontSelection, normal: fontId });
  };

  const setMonoFont = async (fontId: MonoFamilyId) => {
    await saveFontSelection({ ...fontSelection, mono: fontId });
  };

  const setDisplayFont = async (fontId: DisplayFamilyId) => {
    await saveFontSelection({ ...fontSelection, display: fontId });
  };

  const themeId: ThemeId = selectedTheme === "system"
    ? (deviceColorScheme === "dark" ? "dark" : "light")
    : selectedTheme;

  // Get theme colors
  const colors = useMemo(() => themes[themeId], [themeId]);

  // Build fonts from selection
  const fonts = useMemo(() => buildFonts(fontSelection), [fontSelection]);

  // Check if current theme is dark
  const isDark = useMemo(() => isDarkTheme(themeId), [themeId]);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        selectedTheme,
        themeId,
        setTheme,
        colors,
        fonts,
        radius,
        spacing,
        typography,
        fontSelection,
        setNormalFont,
        setMonoFont,
        setDisplayFont,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    if (!hasLoggedMissingThemeProvider) {
      hasLoggedMissingThemeProvider = true;
      console.error("useTheme called outside ThemeProvider; using fallback theme.");
    }
    return fallbackThemeContext;
  }
  return context;
}

// Re-export types
export type {
  DisplayFamilyId,
  NormalFamilyId,
  FontSelection,
  MonoFamilyId,
  ThemeColors,
  ThemeFonts,
  ThemeId,
  ThemeOption,
  ThemeRadius,
  ThemeSpacing,
  ThemeTypography,
};
