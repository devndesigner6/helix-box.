# Lunel Design System

A minimal, borderless design system for the Lunel mobile code editor.
Inspired by [Uber's Base Design System](https://base.uber.com/).

---

## Core Philosophy

### "Depth Through Color, Not Lines"

Visual hierarchy is established through:

1. **Background layering** — Surfaces stack with contrast, no borders needed
2. **Typography weight & opacity** — Text importance through size, weight, and transparency
3. **Whitespace** — Generous spacing creates natural grouping
4. **Accent scarcity** — Color is meaningful because it's rare

### Guiding Principles

| Principle | Description |
|-----------|-------------|
| **Borderless** | Never use borders to separate elements. Use background contrast. |
| **Minimal** | Remove everything that doesn't serve a purpose. |
| **Consistent** | Same patterns everywhere. No special cases. |
| **Accessible** | 4.5:1 contrast ratio minimum. Touch targets ≥44px. |
| **Scannable** | Users should understand hierarchy in <1 second. |

---

## Color Architecture

### Background Layers

The UI is built in **layers**. Each layer is a distinct background color that creates depth without borders.

```
┌─────────────────────────────────────┐
│  bg.elevated   (tooltips, toasts)   │  ← Highest
├─────────────────────────────────────┤
│  bg.overlay    (modals, sheets)     │
├─────────────────────────────────────┤
│  bg.raised     (cards, inputs)      │
├─────────────────────────────────────┤
│  bg.base       (page canvas)        │  ← Lowest
└─────────────────────────────────────┘
```

#### Dark Theme Values
```
bg.base      #0a0a0a    Page background
bg.raised    #141414    Cards, sidebars, inputs
bg.overlay   #1a1a1a    Modals, bottom sheets
bg.elevated  #242424    Tooltips, dropdowns, menus
```

#### Light Theme Values
```
bg.base      #ffffff    Page background
bg.raised    #f7f7f7    Cards, sidebars, inputs
bg.overlay   #f0f0f0    Modals, bottom sheets
bg.elevated  #e8e8e8    Tooltips, dropdowns, menus
```

### Text Opacity System

Instead of multiple text colors, use **opacity on a single foreground color**:

```
text.primary     100% opacity    Main content, headings
text.secondary    60% opacity    Supporting text, labels
text.tertiary     40% opacity    Hints, timestamps, placeholders
text.disabled     25% opacity    Inactive elements
```

This automatically maintains contrast on any background.

### Accent Colors

Accents are used **sparingly** for maximum impact:

```
accent.default    Primary brand color (buttons, links, selection)
accent.subtle     10% opacity of accent (selected backgrounds)
```

**Use accent for:**
- Primary action buttons
- Active/selected states
- Links
- Progress indicators
- Toggle states (on)

**Never use accent for:**
- Large background areas
- Decorative elements
- Icons (except active state)

### Status Colors

Semantic colors for feedback:

```
status.success    Green     Confirmations, success states
status.warning    Amber     Caution, non-blocking issues
status.error      Red       Errors, destructive actions
status.info       Blue      Neutral information
```

Use as:
- Small indicators (dots, badges)
- Text color for status messages
- Subtle background tints (10% opacity)

---

## Typography

### Font Stack

```
Sans:    Inter (UI text)
Mono:    JetBrains Mono (code, terminal)
Display: Khand (large headings, optional)
```

### Type Scale

Based on a **1.2 modular scale** (minor third):

```
text.xs      11px    Badges, captions, timestamps
text.sm      13px    Secondary text, labels
text.base    15px    Body text, primary content
text.lg      17px    Subheadings, emphasized text
text.xl      20px    Section headers
text.2xl     24px    Page titles
text.3xl     32px    Hero text (rare)
```

### Font Weights

```
regular     400    Body text
medium      500    Labels, buttons, emphasis
semibold    600    Headings, important UI
bold        700    Strong emphasis (rare)
```

### Line Heights

```
leading.tight     1.2     Headings, single-line UI
leading.normal    1.5     Body text, multi-line
leading.relaxed   1.7     Long-form reading
```

### Hierarchy Examples

```
Page Title        text.2xl   semibold   text.primary
Section Header    text.xl    semibold   text.primary
Card Title        text.lg    medium     text.primary
Body Text         text.base  regular    text.primary
Label             text.sm    medium     text.secondary
Caption           text.xs    regular    text.tertiary
```

---

## Spacing

### 4px Base Grid

All spacing is a multiple of 4px:

```
space.0     0px     No space
space.1     4px     Tight inline spacing
space.2     8px     Related elements
space.3     12px    Comfortable padding
space.4     16px    Standard padding
space.5     24px    Group separation
space.6     32px    Section separation
space.7     48px    Major sections
space.8     64px    Page-level spacing
```

### Spacing Principles

1. **Proximity = Relationship**
   - Closer items are more related
   - Use space.2 (8px) between related items
   - Use space.5 (24px) between unrelated groups

2. **Consistent Padding**
   - Cards/containers: space.4 (16px) all sides
   - List items: space.3 (12px) vertical, space.4 (16px) horizontal
   - Page margins: space.4 (16px) on mobile

3. **No Borders, More Space**
   - Where you'd add a border, add space.4-5 instead
   - Whitespace IS the separator

---

## Radius

Subtle, not bubbly:

```
radius.none     0px      Sharp corners (rare)
radius.sm       4px      Small elements (badges, chips)
radius.md       8px      Standard (cards, inputs, buttons)
radius.lg       12px     Large containers (modals, sheets)
radius.full     9999px   Circular (avatars, pills)
```

**Rule:** Use radius.md (8px) for most things. Consistency > variety.

---

## Components

### Cards

```
Background:    bg.raised
Padding:       space.4 (16px)
Radius:        radius.md (8px)
Border:        NONE
Shadow:        NONE (dark), subtle (light)
Gap between:   space.4 (16px)
```

### Buttons

**Primary (accent)**
```
Background:    accent.default
Text:          text.inverse (white/black)
Padding:       space.3 (12px) vertical, space.5 (24px) horizontal
Radius:        radius.md (8px)
Height:        48px (touch-friendly)

Hover:         accent.hover (darken 10%)
Pressed:       accent.active (darken 20%)
```

**Secondary (ghost)**
```
Background:    transparent
Text:          text.primary
Padding:       same as primary

Hover:         bg.raised
Pressed:       bg.overlay
```

### Inputs

```
Background:    bg.raised
Text:          text.primary
Placeholder:   text.tertiary
Padding:       space.3 (12px) vertical, space.4 (16px) horizontal
Radius:        radius.md (8px)
Height:        48px
Border:        NONE

Focus:         2px ring in accent.default (outline, not border)
```

### Lists

```
Background:    transparent (inherit from parent)
Item padding:  space.3 (12px) vertical, space.4 (16px) horizontal
Gap:           space.1 (4px) — subtle separation
Dividers:      NONE — spacing is the divider

Selected:      bg.raised background
Active:        bg.overlay background
```

### Headers/Toolbars

```
Background:    bg.base (blends with page)
Height:        56px
Padding:       space.2 (8px) horizontal
Border-bottom: NONE

Separation from content: space.4 (16px) gap below
```

### Modals/Sheets

```
Background:    bg.overlay
Radius:        radius.lg (12px) top corners
Padding:       space.4 (16px)

Backdrop:      #000000 at 50% opacity
```

### Tabs

```
Background:    transparent
Text:          text.secondary

Active tab:
  Text:        text.primary
  Indicator:   2px bottom bar in accent.default
               OR bg.raised background with radius
```

---

## Icons

### Sizes

```
icon.sm     16px    Dense UI, inline with small text
icon.md     20px    Standard UI, buttons, list items
icon.lg     24px    Touch targets, headers
icon.xl     32px    Feature icons, empty states
```

### Colors

```
Default:       text.secondary (60% opacity)
Active:        text.primary (100% opacity)
Accent:        accent.default (interactive elements only)
```

**Never use colored icons decoratively.** Color = meaning.

---

## States

### Interactive States

```
Default    →  Base styling
Hover      →  bg shifts one layer up (raised → overlay)
Pressed    →  bg shifts two layers up
Focused    →  2px accent outline (accessibility)
Disabled   →  25% opacity, no pointer events
```

### Selection States

```
Unselected   →  transparent bg, text.secondary
Selected     →  bg.raised, text.primary
              OR accent.subtle bg, accent text
```

### Loading States

```
Skeleton     →  bg.raised with subtle pulse animation
Spinner      →  accent.default color
Disabled     →  Reduced opacity of entire element
```

---

## Motion

### Durations

```
instant      0ms       Immediate feedback
fast         100ms     Micro-interactions (hover, press)
normal       200ms     Standard transitions
slow         300ms     Complex animations
```

### Easings

```
ease-out     cubic-bezier(0, 0, 0.2, 1)     Entering elements
ease-in      cubic-bezier(0.4, 0, 1, 1)     Exiting elements
ease-both    cubic-bezier(0.4, 0, 0.2, 1)   Moving elements
spring       Custom spring physics           Playful interactions
```

### Principles

1. **Purposeful** — Animation communicates, not decorates
2. **Fast** — Never make users wait for animation
3. **Consistent** — Same action = same animation everywhere

---

## Shadows (Light Theme Only)

Shadows add depth in light themes. Dark themes use bg contrast instead.

```
shadow.sm     0 1px 2px rgba(0,0,0,0.05)     Raised elements
shadow.md     0 4px 12px rgba(0,0,0,0.08)    Dropdowns, cards
shadow.lg     0 12px 32px rgba(0,0,0,0.12)   Modals, sheets
```

**Dark theme:** No shadows. Ever. Use bg.overlay/bg.elevated instead.

---

## Accessibility

### Contrast

- **Text:** Minimum 4.5:1 against background
- **Large text (18px+):** Minimum 3:1
- **UI components:** Minimum 3:1

### Touch Targets

- Minimum size: 44x44px
- Spacing between targets: 8px minimum

### Focus Indicators

- Always visible on keyboard focus
- 2px solid outline in accent.default
- Never remove focus styles

### Motion

- Respect `prefers-reduced-motion`
- Provide static alternatives

---

## Anti-Patterns

### Never Do This

| Bad Practice | Do This Instead |
|--------------|-----------------|
| Border to separate items | Use bg contrast or spacing |
| Border around cards | Use bg.raised on bg.base |
| Border on inputs | Use bg.raised, focus ring |
| Colored backgrounds for sections | Use bg layers |
| Many accent colors | Single accent, used sparingly |
| Custom colors per component | Use system tokens only |
| Shadows in dark mode | Use bg.elevated |
| Decorative icons with color | Icons are text.secondary |

---

## File Structure

```
constants/
  themes.ts         Color tokens, theme definitions
  typography.ts     Font sizes, weights, line heights
  spacing.ts        Spacing scale
  radius.ts         Border radius scale

components/
  primitives/       Basic building blocks
    Box.tsx         Layout container with bg/spacing
    Text.tsx        Typography component
    Pressable.tsx   Touch element with states

  ui/               Composed components
    Button.tsx
    Card.tsx
    Input.tsx
    List.tsx
```

---

## Token Naming Convention

```
[category].[property].[variant]

bg.base
bg.raised
text.primary
text.secondary
accent.default
accent.subtle
space.4
radius.md
```

---

## Quick Reference

### Background Selection

| Element | Background |
|---------|------------|
| Page | bg.base |
| Sidebar | bg.raised |
| Card | bg.raised |
| Input | bg.raised |
| Modal | bg.overlay |
| Dropdown | bg.elevated |
| Tooltip | bg.elevated |
| Selected item | bg.raised or accent.subtle |

### Text Selection

| Element | Color | Weight |
|---------|-------|--------|
| Page title | text.primary | semibold |
| Section header | text.primary | semibold |
| Body text | text.primary | regular |
| Label | text.secondary | medium |
| Placeholder | text.tertiary | regular |
| Hint/caption | text.tertiary | regular |
| Disabled | text.disabled | regular |

---

## Changelog

### v1.0.0
- Initial design system documentation
- Borderless philosophy established
- Background layer system defined
- Typography and spacing scales

---

*This is a living document. Update as patterns evolve.*
