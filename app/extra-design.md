# Extra Plugins Design Guide

Extension of `design.md` specifically for extra plugins (Tools, Ports, HTTP, Monitor, etc.).
These patterns ensure visual consistency across all plugin panels.

---

## Panel Anatomy

Every plugin panel follows this structure:

```
┌─────────────────────────────────────┐
│  HEADER (56px)                      │  ← Fixed height, always visible
├─────────────────────────────────────┤
│                                     │
│  CONTENT (flex: 1, scrollable)      │  ← Main scrollable area
│                                     │
├─────────────────────────────────────┤
│  BOTTOM BAR (optional)              │  ← Persistent actions/input
└─────────────────────────────────────┘
```

---

## Header Pattern

**Height:** Always `56px` (not 50px - gives more breathing room)

```tsx
<View style={{
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
  paddingRight: spacing[2],
}}>
  {/* Menu button */}
  <TouchableOpacity
    onPress={openDrawer}
    style={{ paddingHorizontal: spacing[4], height: 56, justifyContent: 'center' }}
  >
    <Ionicons name="menu" size={22} color={colors.fg.default} />
  </TouchableOpacity>

  {/* Title */}
  <Text style={{
    flex: 1,
    fontSize: 17,
    fontFamily: fonts.sans.semibold,
    color: colors.fg.default,
  }}>
    Plugin Name
  </Text>

  {/* Action icons (right side) */}
  <TouchableOpacity style={{ padding: spacing[3] }}>
    <Ionicons name="icon-name" size={20} color={colors.fg.muted} />
  </TouchableOpacity>
</View>
```

**Rules:**
- Menu button: `paddingHorizontal: spacing[4]`, full height touch target
- Title: `fontSize: 17`, `semibold`, `flex: 1`
- Action icons: `padding: spacing[3]`, `size={20}`, `color={colors.fg.muted}`
- Max 2-3 action icons on right

---

## Bottom Action Bar

For persistent inputs or quick actions that should always be visible.

```tsx
<View style={{ backgroundColor: colors.bg.raised }}>
  {/* Optional status/result row */}
  {result && (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
    }}>
      {/* Status content */}
    </View>
  )}

  {/* Quick action chips (horizontal scroll) */}
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      gap: spacing[2],
    }}
  >
    {/* Chips */}
  </ScrollView>

  {/* Input row */}
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[4],
    gap: spacing[2],
  }}>
    <TextInput style={{ flex: 1, ... }} />
    <TouchableOpacity style={{ width: 48, height: 48, ... }}>
      {/* Action button */}
    </TouchableOpacity>
  </View>
</View>
```

**Rules:**
- Background: `colors.bg.raised`
- Input background: `colors.bg.base` (one layer down for contrast)
- Action button: `48x48px` square, `radius.md`
- Bottom padding: `spacing[4]` (safe area consideration)

---

## Hero Numbers

Large, prominent values that are the focus of a card.

```tsx
<Text style={{
  fontSize: 24,  // or 36 for extra emphasis
  fontFamily: fonts.mono.regular,
  color: colors.accent.default,  // or colors.fg.default
}}>
  :3000
</Text>
```

**Usage:**
- Port numbers: `fontSize: 24`, `colors.accent.default`
- Percentages (CPU, Memory): `fontSize: 36`, `colors.fg.default`
- Status codes: `fontSize: 13`, inside colored badge

---

## Status Badges

Small pills showing state or status.

```tsx
<View style={{
  paddingHorizontal: spacing[2],
  paddingVertical: 2,
  borderRadius: radius.sm,
  backgroundColor: statusColor + '20',  // 20% opacity
}}>
  <Text style={{
    fontSize: 10,
    fontFamily: fonts.sans.bold,
    color: statusColor,
  }}>
    LISTEN
  </Text>
</View>
```

**Rules:**
- Background: Status color at 20% opacity (`+ '20'`)
- Text: `fontSize: 10`, `fonts.sans.bold`, full status color
- Padding: `spacing[2]` horizontal, `2px` vertical
- Radius: `radius.sm`
- Always UPPERCASE

---

## Method/Type Pills

For HTTP methods, protocols, categories.

```tsx
<TouchableOpacity style={{
  paddingHorizontal: spacing[3],
  paddingVertical: spacing[3],
  borderRadius: radius.md,
  backgroundColor: methodColor + '20',
  minWidth: 70,
  alignItems: 'center',
}}>
  <Text style={{
    fontSize: 13,
    fontFamily: fonts.sans.bold,
    color: methodColor,
  }}>
    GET
  </Text>
</TouchableOpacity>
```

**Method Colors:**
```typescript
const METHOD_COLORS = {
  GET: '#22c55e',     // green
  POST: '#3b82f6',    // blue
  PUT: '#f59e0b',     // amber
  DELETE: '#ef4444',  // red
  PATCH: '#a855f7',   // purple
};
```

---

## Quick Action Chips

Horizontal scrollable row of tappable options.

```tsx
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  }}
>
  {options.map((option) => (
    <TouchableOpacity
      key={option.id}
      style={{
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        borderRadius: radius.full,  // pill shape
        backgroundColor: colors.bg.base,  // or bg.overlay if on bg.base
      }}
    >
      <Text style={{
        fontSize: 13,
        fontFamily: fonts.mono.regular,  // or sans.medium
        color: colors.fg.default,
      }}>
        {option.label}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
```

**Rules:**
- Container: horizontal ScrollView, no indicator
- Chips: `radius.full` for pill shape
- Gap: `spacing[2]`
- Horizontal padding on container: `spacing[4]`

---

## Collapsible Sections

For grouping related content that can be expanded/collapsed.

```tsx
<View style={{ marginBottom: spacing[3] }}>
  {/* Header (always visible) */}
  <TouchableOpacity
    onPress={toggle}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      backgroundColor: colors.bg.raised,
      borderRadius: expanded ? undefined : radius.md,
      borderTopLeftRadius: radius.md,
      borderTopRightRadius: radius.md,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
      <Ionicons
        name={expanded ? 'chevron-down' : 'chevron-forward'}
        size={16}
        color={colors.fg.muted}
      />
      <Text style={{
        fontSize: 12,
        fontFamily: fonts.sans.semibold,
        color: colors.fg.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}>
        Section Title
      </Text>
    </View>
    {/* Optional right content (count, status) */}
  </TouchableOpacity>

  {/* Content (conditional) */}
  {expanded && (
    <View style={{
      backgroundColor: colors.bg.raised,
      borderBottomLeftRadius: radius.md,
      borderBottomRightRadius: radius.md,
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[4],
    }}>
      {children}
    </View>
  )}
</View>
```

**Rules:**
- Chevron: `size={16}`, points right when collapsed, down when expanded
- Title: `fontSize: 12`, `uppercase`, `letterSpacing: 0.5`
- Radius: Top corners always rounded, bottom corners only when collapsed

---

## Cards

Content containers within the scrollable area.

```tsx
<View style={{
  backgroundColor: colors.bg.raised,
  borderRadius: radius.md,  // or radius.lg for prominent cards
  padding: spacing[4],
  marginBottom: spacing[2],  // or spacing[3] for more separation
}}>
  {/* Card content */}
</View>
```

**Variants:**
- **Standard card:** `radius.md`, `marginBottom: spacing[2]`
- **Prominent card:** `radius.lg`, `marginBottom: spacing[3]`
- **Grouped cards:** Same process/category, `marginBottom: spacing[2]` between

---

## Section Headers (within scroll)

For grouping cards by category.

```tsx
<View style={{
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[2],
  marginBottom: spacing[2],
}}>
  <Ionicons name="terminal" size={14} color={colors.fg.muted} />
  <Text style={{
    fontSize: 12,
    fontFamily: fonts.sans.semibold,
    color: colors.fg.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }}>
    Category Name
  </Text>
  <Text style={{
    fontSize: 11,
    fontFamily: fonts.sans.regular,
    color: colors.fg.subtle,
  }}>
    (3)
  </Text>
</View>
```

---

## Modal Sheets

For pickers, history, settings that overlay the screen.

```tsx
<Modal
  visible={visible}
  transparent
  animationType="slide"  // or "fade" for small pickers
  onRequestClose={onClose}
>
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
    {/* Tap to dismiss area */}
    <TouchableOpacity style={{ flex: 0.3 }} onPress={onClose} />

    {/* Sheet content */}
    <View style={{
      flex: 0.7,
      backgroundColor: colors.bg.overlay,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
      }}>
        <Text style={{
          fontSize: 17,
          fontFamily: fonts.sans.semibold,
          color: colors.fg.default,
        }}>
          Sheet Title
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.fg.muted} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }}>
        {/* ... */}
      </ScrollView>
    </View>
  </View>
</Modal>
```

**Small Picker (centered):**
```tsx
<Modal visible={visible} transparent animationType="fade">
  <TouchableOpacity
    style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    activeOpacity={1}
    onPress={onClose}
  >
    <View style={{
      backgroundColor: colors.bg.elevated,
      borderRadius: radius.lg,
      padding: spacing[2],
      minWidth: 150,
    }}>
      {/* Options */}
    </View>
  </TouchableOpacity>
</Modal>
```

---

## Input Fields

```tsx
<TextInput
  style={{
    flex: 1,  // or fixed width
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    fontSize: 14,
    fontFamily: fonts.mono.regular,  // for code/data, sans.regular for text
    color: colors.fg.default,
    backgroundColor: colors.bg.raised,  // or bg.base if inside bg.raised container
  }}
  placeholder="Placeholder text..."
  placeholderTextColor={colors.fg.muted}
  // For specific input types:
  keyboardType="number-pad"  // for ports, numbers
  autoCapitalize="none"      // for URLs, code
  autoCorrect={false}        // for URLs, code
/>
```

---

## Action Buttons

**Primary (square, icon only):**
```tsx
<TouchableOpacity
  onPress={action}
  disabled={isDisabled}
  style={{
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: isDisabled ? colors.bg.overlay : colors.accent.default,
  }}
>
  <Ionicons
    name="arrow-forward"
    size={20}
    color={isDisabled ? colors.fg.muted : '#fff'}
  />
</TouchableOpacity>
```

**Secondary (text button):**
```tsx
<TouchableOpacity
  onPress={action}
  style={{
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    backgroundColor: colors.status.error + '15',  // subtle tint
  }}
>
  <Text style={{
    fontSize: 13,
    fontFamily: fonts.sans.semibold,
    color: colors.status.error,
  }}>
    Kill
  </Text>
</TouchableOpacity>
```

---

## Empty States

When there's no content to display.

```tsx
<View style={{
  alignItems: 'center',
  paddingVertical: spacing[8],
}}>
  <Ionicons name="cloud-outline" size={40} color={colors.fg.subtle} />
  <Text style={{
    fontSize: 14,
    fontFamily: fonts.sans.medium,
    color: colors.fg.muted,
    marginTop: spacing[3],
  }}>
    No items to display
  </Text>
</View>
```

**Rules:**
- Icon: `size={40}` (or 48), `colors.fg.subtle`
- Text: `fontSize: 14`, `fonts.sans.medium`, `colors.fg.muted`
- Padding: `spacing[8]` vertical

---

## Key-Value Rows

For displaying data pairs (headers, properties).

```tsx
<View style={{ flexDirection: 'row', marginBottom: spacing[1] }}>
  <Text style={{
    fontSize: 12,
    fontFamily: fonts.mono.regular,
    color: colors.accent.default,
  }}>
    {key}:
  </Text>
  <Text style={{
    fontSize: 12,
    fontFamily: fonts.mono.regular,
    color: colors.fg.default,
    marginLeft: spacing[2],
    flex: 1,
  }}>
    {value}
  </Text>
</View>
```

---

## Progress Bars

```tsx
const ProgressBar = ({ percent, color, height = 6 }) => (
  <View style={{
    height,
    backgroundColor: colors.bg.base,
    borderRadius: radius.full,
    overflow: 'hidden',
  }}>
    <View style={{
      height: '100%',
      width: `${Math.min(percent, 100)}%`,
      backgroundColor: color,
      borderRadius: radius.full,
    }} />
  </View>
);
```

**Height variants:**
- Default: `6px`
- Emphasized: `8px`

---

## Checklist: New Plugin Panel

When creating a new plugin, verify:

- [ ] Header is 56px with correct spacing
- [ ] Title is 17px semibold
- [ ] Action icons are 20px, muted color
- [ ] Cards use bg.raised on bg.base
- [ ] Inputs inside cards use bg.base
- [ ] Status badges use color + '20' background
- [ ] Section headers are 12px, uppercase, letter-spaced
- [ ] Empty states have 40px icon, centered
- [ ] Bottom bar (if any) has spacing[4] bottom padding
- [ ] Modals use bg.overlay or bg.elevated
- [ ] Touch targets are at least 44px
- [ ] Fonts: mono for data/code, sans for labels

---

*Follow these patterns to maintain consistency across all extra plugins.*
