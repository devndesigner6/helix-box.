/**
 * SessionRegistry — exposes each plugin's internal tab list to the sidebar.
 *
 * Design:
 * - Split into two contexts:
 *   - ActionsContext: { register, unregister } — stable, never changes.
 *   - DataContext:    { registry }             — changes when sessions/activeId change.
 *
 * Panels use useSessionRegistryActions() → subscribe only to stable actions
 * → never re-render due to registry updates → no infinite loop.
 *
 * DrawerContent uses useSessionRegistry() → subscribes to registry data
 * → re-renders when sessions change → highlight and list stay correct.
 *
 * Callback freshness: when only callbacks change (not display data), register()
 * mutates them in place and returns prev — React bails out, no state change,
 * DrawerContent doesn't re-render, but callbacks are still up-to-date.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface SessionItem {
  id: string;
  title: string;
  backend?: string;
}

export interface SessionRegistration {
  sessions: SessionItem[];
  activeSessionId: string | null;
  loading?: boolean;
  onSessionPress: (id: string) => void;
  onSessionClose: (id: string) => void;
  onSessionRename?: (id: string, title: string) => void;
  onCreateSession: () => void;
  onReconnectRefreshSession?: (id: string) => Promise<void> | void;
  onReconnectRefreshAll?: () => Promise<void> | void;
}

interface SessionRegistryActionsContextType {
  register: (pluginId: string, reg: SessionRegistration) => void;
  unregister: (pluginId: string) => void;
}

interface SessionRegistryDataContextType {
  registry: Record<string, SessionRegistration>;
}

const SessionRegistryActionsContext = createContext<SessionRegistryActionsContextType | undefined>(undefined);
const SessionRegistryDataContext = createContext<SessionRegistryDataContextType | undefined>(undefined);

export function SessionRegistryProvider({ children }: { children: React.ReactNode }) {
  const [registry, setRegistry] = useState<Record<string, SessionRegistration>>({});

  const register = useCallback((pluginId: string, reg: SessionRegistration) => {
    setRegistry((prev) => {
      const existing = prev[pluginId];

      // If only callbacks changed (not what the sidebar displays), mutate them
      // in place and return prev — same reference → React bails out → no re-render
      // → no infinite loop.
      if (
        existing &&
        existing.sessions === reg.sessions &&
        existing.activeSessionId === reg.activeSessionId &&
        existing.loading === reg.loading
      ) {
        existing.onSessionPress = reg.onSessionPress;
        existing.onSessionClose = reg.onSessionClose;
        existing.onSessionRename = reg.onSessionRename;
        existing.onCreateSession = reg.onCreateSession;
        existing.onReconnectRefreshSession = reg.onReconnectRefreshSession;
        existing.onReconnectRefreshAll = reg.onReconnectRefreshAll;
        return prev;
      }

      return { ...prev, [pluginId]: reg };
    });
  }, []);

  const unregister = useCallback((pluginId: string) => {
    setRegistry((prev) => {
      const next = { ...prev };
      delete next[pluginId];
      return next;
    });
  }, []);

  // Actions never change — register/unregister have [] deps.
  // useMemo is a safeguard; the object reference will be stable in practice.
  const actions = useMemo(
    () => ({ register, unregister }),
    [register, unregister]
  );

  const data = useMemo(() => ({ registry }), [registry]);

  return (
    <SessionRegistryActionsContext.Provider value={actions}>
      <SessionRegistryDataContext.Provider value={data}>
        {children}
      </SessionRegistryDataContext.Provider>
    </SessionRegistryActionsContext.Provider>
  );
}

/** Used by panels to register/unregister. Never triggers re-renders from registry updates. */
export function useSessionRegistryActions() {
  const ctx = useContext(SessionRegistryActionsContext);
  if (!ctx) throw new Error("useSessionRegistryActions must be used within SessionRegistryProvider");
  return ctx;
}

/** Used by the sidebar to read registry data. Re-renders when sessions/activeId change. */
export function useSessionRegistry() {
  const ctx = useContext(SessionRegistryDataContext);
  if (!ctx) throw new Error("useSessionRegistry must be used within SessionRegistryProvider");
  return ctx;
}
