import { DEFAULT_EDITOR_CONFIG, EditorConfig } from "@/components/editor/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const EDITOR_CONFIG_STORAGE_KEY = "@lunel_editor_config";

interface EditorContextType {
  config: EditorConfig;
  updateConfig: <K extends keyof EditorConfig>(key: K, value: EditorConfig[K]) => Promise<void>;
  setConfig: (config: EditorConfig) => Promise<void>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<EditorConfig>(DEFAULT_EDITOR_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const saved = await AsyncStorage.getItem(EDITOR_CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated = {
          ...DEFAULT_EDITOR_CONFIG,
          ...parsed,
          aiFontSize: 14,
        };
        setConfigState(migrated);
      }
    } catch (error) {
      console.error("Failed to load editor config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setConfig = async (newConfig: EditorConfig) => {
    setConfigState(newConfig);
    try {
      await AsyncStorage.setItem(EDITOR_CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.error("Failed to save editor config:", error);
    }
  };

  const updateConfig = async <K extends keyof EditorConfig>(
    key: K,
    value: EditorConfig[K]
  ) => {
    const newConfig = { ...config, [key]: value };
    await setConfig(newConfig);
  };

  if (isLoading) {
    return null;
  }

  return (
    <EditorContext.Provider value={{ config, updateConfig, setConfig }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorConfig() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorConfig must be used within an EditorProvider");
  }
  return context;
}
