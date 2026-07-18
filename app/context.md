# Lunel App - Performance Optimization Context

## Project Overview
Lunel is a React Native/Expo mobile IDE that connects to developer machines via WebSocket proxy. It has a plugin-based architecture with a bottom navigation bar.

**Key directories:**
- `/Users/soham/lunel/lunel` - Main React Native app
- `/Users/soham/lunel/lunel-cli` - Node.js CLI (runs on dev machine)
- `/Users/soham/lunel/lunel-proxy` - Bun WebSocket relay server

## What Was Already Done

### 1. PluginBottomBar.tsx - Converted to Reanimated
- ✅ Uses `react-native-reanimated` for 60fps animations
- ✅ Uses `react-native-gesture-handler` instead of PanResponder
- ✅ Memoized `PluginButton` component with `React.memo`
- ✅ Extracted styles to `StyleSheet.create()`
- ✅ Uses `useCallback`/`useMemo` for handlers

### 2. PluginRenderer.tsx - Smart Memoization
- ✅ `MemoizedPanel` with custom comparison - inactive panels never re-render
- ✅ `pointerEvents: 'none'` on hidden panels
- ✅ `useMemo` for tabs list

### 3. Plugin System Changes
- ✅ Single instance per plugin (no multiple tabs of same plugin)
- ✅ Removed "New Tab" button and tab list from bottom bar
- ✅ Simplified to plugin switcher pattern

### 4. Other Fixes
- ✅ Fixed proxy session locking bug (app couldn't connect both channels)
- ✅ Updated proxy URL to `gateway.lunel.dev`
- ✅ Fixed TypeScript errors (`accent.primary` → `accent.default`, etc.)
- ✅ Fixed duplicate key error in Ports plugin

### 5. FlashList Integration
- ✅ Installed `@shopify/flash-list` v2.0.2
- ✅ Converted Explorer Panel to use FlashList for file lists
- ✅ Created memoized `FileItem` component for Explorer

### 6. Plugin Panel Memoization
- ✅ All plugin panels wrapped with `React.memo`:
  - `plugins/extra/ports/Panel.tsx`
  - `plugins/extra/processes/Panel.tsx`
  - `plugins/extra/http/Panel.tsx`
  - `plugins/extra/monitor/Panel.tsx`
  - `plugins/extra/explorer/Panel.tsx`
  - `plugins/extra/git/Panel.tsx`
  - `plugins/extra/tools/Panel.tsx`

### 7. Context Optimization
- ✅ `ConnectionContext` value memoized with `useMemo`
- ✅ `ThemeContext` already had `useMemo` for computed values

---

## What Still Needs To Be Done

### A) Extend FlashList to Other Panels (MEDIUM IMPACT)
Explorer Panel already uses FlashList. Consider adding to other panels with large lists:

**Remaining files (optional - lists are typically small):**
- `plugins/extra/ports/Panel.tsx` - grouped by process, typically < 20 items
- `plugins/extra/processes/Panel.tsx` - typically < 50 items
- `plugins/extra/http/Panel.tsx` - capped at 50 history items
- `plugins/extra/git/Panel.tsx` - commits list could benefit

**Pattern (FlashList 2.0 - no estimatedItemSize needed):**
```tsx
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  keyExtractor={(item) => item.id}
/>
```

### B) Use InteractionManager for Heavy Work
Defer expensive operations until after animations complete:

```tsx
import { InteractionManager } from 'react-native';

// In useEffect or handlers
useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    // Heavy work here - loading data, parsing, etc.
    loadPorts();
  });

  return () => task.cancel();
}, []);
```

### C) Use useDeferredValue for Search/Filter
For search inputs that filter lists:

```tsx
import { useDeferredValue } from 'react';

const [searchText, setSearchText] = useState('');
const deferredSearch = useDeferredValue(searchText);

// Use deferredSearch for filtering - won't block typing
const filteredItems = items.filter(item =>
  item.name.includes(deferredSearch)
);
```

### D) Extract All Inline Styles to StyleSheet
Search for inline styles and extract:

```bash
# Find inline styles
grep -r "style={{" plugins/extra/
```

Convert to StyleSheet:
```tsx
// BEFORE
<View style={{ flex: 1, padding: 16, backgroundColor: colors.bg.base }}>

// AFTER
<View style={[styles.container, { backgroundColor: colors.bg.base }]}>

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
```

### E) Remove Console.logs in Production
Add babel plugin or wrap:

```tsx
// utils/logger.ts
export const log = __DEV__ ? console.log : () => {};
```

---

## Architecture Reference

### Plugin System Files
- `plugins/types.ts` - PluginDefinition, PluginInstance interfaces
- `plugins/registry.ts` - Singleton plugin registry
- `plugins/context.tsx` - PluginProvider, usePlugins hook
- `plugins/gpi.ts` - Cross-plugin communication
- `plugins/innerApi.ts` - Imperative refresh API for bottom bar

### Key Components
- `components/PluginBottomBar.tsx` - Bottom nav (ALREADY OPTIMIZED)
- `components/PluginRenderer.tsx` - Renders active plugin (ALREADY OPTIMIZED)
- `components/PluginHeader.tsx` - Tab header for plugins with internal tabs

### Plugin Panel Props
```tsx
interface PluginPanelProps {
  instanceId: string;
  isActive: boolean;
}
```

### Theme Usage
```tsx
const { colors, fonts, spacing, radius } = useTheme();
// colors.bg.base, colors.fg.default, colors.accent.default, etc.
// spacing[1-8], radius.sm/md/lg
```

---

## Commands

```bash
# Type check
npx tsc --noEmit

# Run app
npx expo start

# Install FlashList
npx expo install @shopify/flash-list
```

---

## Priority Order (Remaining)

1. **Extend FlashList** - Add to Git commits panel if performance issues arise
2. **StyleSheet extraction** - Reduces object creation
3. **InteractionManager** - Smoother transitions
4. **useDeferredValue** - Better input responsiveness
5. **Console.log cleanup** - Production polish
