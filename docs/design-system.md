# Aether — Design System

## Overview

Aether's visual identity is built around a dark-first, premium aesthetic. The design should feel like a professional developer tool — clean, precise, and functional — while still being visually striking. Think Linear meets Notion with the polish of Vercel's dashboard.

---

## Color Palette

### Core Colors

| Token | Value | Usage |
|---|---|---|
| `--background` | `#050505` | Page background. Near-black, not pure black. |
| `--surface` | `#0c0c0f` | Card backgrounds, elevated surfaces. |
| `--surface-light` | `#14141a` | Hover states on surfaces, subtle backgrounds. |
| `--surface-hover` | `#1a1a24` | Active/pressed states. |

### Text Colors

| Token | Value | Usage |
|---|---|---|
| `--foreground` | `#eeeef0` | Primary text. High contrast against background. |
| `--text-secondary` | `#94949e` | Secondary text, descriptions, labels. |
| `--text-muted` | `#5a5a66` | Placeholder text, disabled states, timestamps. |

### Border Colors

| Token | Value | Usage |
|---|---|---|
| `--border-color` | `rgba(255,255,255,0.06)` | Default borders. Barely visible, adds structure. |
| `--border-hover` | `rgba(255,255,255,0.12)` | Borders on hover/focus. |

### Accent Colors

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#6366f1` | Primary action buttons, active states, links. |
| `--accent-hover` | `#818cf8` | Hover state for accent elements. |

### Semantic Colors

| Color | Hex | Usage |
|---|---|---|
| Emerald | `#34d399` | Success, completed, active indicators. |
| Amber | `#fbbf24` | Warnings, in-progress states. |
| Rose | `#f43f5e` | Errors, destructive actions, critical priority. |
| Violet | `#a78bfa` | Goals, streaks, secondary accent. |

### Why these specific colors?

- **Near-black background (#050505) instead of pure black (#000000):** Pure black creates harsh contrast with text and makes the interface feel flat. A very dark gray preserves depth and allows surface layers to stand out.
- **Indigo accent (#6366f1) instead of blue (#3b82f6):** Indigo sits between blue and purple, giving the app a distinctive identity that avoids looking like a generic Bootstrap dashboard.
- **Low-opacity borders instead of solid borders:** They create structure without visual noise. The UI feels organized without feeling heavy.

---

## Typography

### Font Stack

- **Primary:** Geist Sans (loaded via `next/font/google`).
- **Monospace:** Geist Mono (for code, timestamps, technical data).
- **Fallback:** `ui-sans-serif, system-ui, sans-serif`.

### Scale

| Name | Size | Weight | Usage |
|---|---|---|---|
| Display | 3.75rem (60px) | 800 | Landing page hero heading |
| H1 | 1.875rem (30px) | 700 | Page titles |
| H2 | 1.5rem (24px) | 600 | Section headings |
| H3 | 1.125rem (18px) | 600 | Card titles, subsection headings |
| Body | 0.875rem (14px) | 400 | Default text |
| Small | 0.75rem (12px) | 400 | Labels, timestamps, metadata |
| Tiny | 0.6875rem (11px) | 500 | Badges, counters |

### Why 14px as default body?

Dashboard interfaces display dense information. 16px (browser default) wastes space and makes the interface feel padded. 14px is the standard for professional dashboards (GitHub, Linear, Jira) because it balances readability with density.

---

## Spacing System

All spacing uses a 4px base unit, applied through Tailwind's spacing scale:

| Tailwind | Value | Usage |
|---|---|---|
| `p-1` / `gap-1` | 4px | Tight spacing between icons and text |
| `p-2` / `gap-2` | 8px | Spacing within compact components |
| `p-3` / `gap-3` | 12px | Internal padding for small cards |
| `p-4` / `gap-4` | 16px | Standard internal padding |
| `p-5` / `gap-5` | 20px | Comfortable padding for cards |
| `p-6` / `gap-6` | 24px | Generous padding for major cards |
| `p-8` / `gap-8` | 32px | Section spacing within pages |
| `p-10` / `gap-10` | 40px | Section padding for page areas |
| `py-24` | 96px | Vertical spacing between landing page sections |

### Consistency Rule

- Within a component: use the same spacing value for all internal gaps.
- Between components: use the next step up from the internal spacing.
- Padding inside a card should be at least twice the gap between elements inside it.

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-md` | 6px | Small elements: badges, tags, inputs |
| `rounded-lg` | 8px | Buttons, nav items |
| `rounded-xl` | 12px | Cards, dropdowns |
| `rounded-2xl` | 16px | Major cards, modal containers |
| `rounded-full` | 9999px | Avatars, status indicators, pills |

### Rule

Larger surfaces get larger radii. A button is `rounded-lg`. A card is `rounded-xl`. A modal is `rounded-2xl`. Never use `rounded-sm` (4px) — it looks indecisive.

---

## Shadow Usage

Aether uses shadows sparingly. In a dark theme, traditional box shadows are nearly invisible. Instead, use:

| Effect | Implementation | Usage |
|---|---|---|
| Elevation | `border` with low-opacity white | Cards, surfaces |
| Glow | `box-shadow` with accent color | Active buttons, focused inputs |
| Depth | Layered surfaces with distinct background colors | Sidebar over background, modal over content |

### Button Glow

```css
box-shadow: 0 0 20px rgba(99, 102, 241, 0.3), 0 4px 15px rgba(99, 102, 241, 0.2);
```

### Card Hover

```css
box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.1), 0 8px 40px -12px rgba(99, 102, 241, 0.15);
```

---

## Animation Philosophy

### Principles

1. **Purposeful:** Every animation communicates something. Elements fade in because they just loaded. Elements slide because they moved. Elements scale because they were activated.
2. **Fast:** Most transitions complete in 200-300ms. Anything longer feels sluggish in a productivity tool.
3. **Subtle:** Animations enhance, never distract. Users should feel the polish without noticing individual animations.
4. **Consistent:** The same type of action uses the same type of animation everywhere.

### Standard Timing

| Animation | Duration | Easing |
|---|---|---|
| Hover state | 200ms | `ease` |
| Content fade-in | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Modal enter | 250ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Modal exit | 150ms | `ease-in` |
| Slide transition | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Toast notification | 200ms enter, 150ms exit | `ease-out` / `ease-in` |

### Easing

The custom easing `cubic-bezier(0.16, 1, 0.3, 1)` is used throughout the app. It starts fast and decelerates smoothly, creating a natural "settling" feel. This matches the easing used by Linear and Raycast.

---

## Icons

- **Source:** Lucide Icons (consistent with the React ecosystem).
- **Size:** 16px for inline, 18px for buttons, 20px for navigation, 24px for feature highlights.
- **Stroke width:** 1.5 for most icons, 2 for smaller sizes.
- **Color:** Inherits from `currentColor`. Never hardcode icon colors.

---

## Dark Theme

Aether is dark-first. There is no light theme in v0.x. A light theme will be introduced in v1.0 when the `UserSettings.theme` field is implemented.

### Dark Theme Rules

1. Background surfaces layer from darkest (page) to lightest (card hover).
2. Text layers from brightest (primary) to dimmest (muted).
3. Borders are always semi-transparent white, never solid gray.
4. Accent colors are vibrant against the dark background. Do not desaturate them.

---

## Accessibility

### Minimum Standards

- All interactive elements are keyboard accessible.
- Focus rings use the accent color with sufficient contrast.
- All images have `alt` text. Decorative images use `alt=""`.
- Color is never the only indicator of state. Use icons or text alongside color.
- Text contrast ratios meet WCAG 2.1 AA standards (4.5:1 for body text, 3:1 for large text).

### Focus Ring Style

```css
outline: 2px solid var(--accent);
outline-offset: 2px;
```

---

## Component Consistency

### Buttons

| Variant | Usage |
|---|---|
| Primary | Main call-to-action. Gradient background with glow. |
| Secondary | Secondary actions. Transparent with border. |
| Ghost | Tertiary actions. No border, no background. Text only. |
| Destructive | Delete, cancel, remove. Rose-colored. |

### Cards

All cards use the `.card-elevated` class which provides:

- Gradient background (surface → darker surface).
- 1px semi-transparent border.
- Hover: border color shifts to accent, subtle lift, glow shadow.

### Inputs

- Background: `--surface`.
- Border: `--border-color`, transitions to `--accent` on focus.
- Placeholder text: `--text-muted`.
- Height: 40px for standard inputs, 36px for compact contexts.

### Badges

- Small rounded pill with background and text.
- Status badges use semantic colors.
- Priority badges use the priority color scale.

---

## Dashboard Appearance

The dashboard should feel like a mission control center. Key principles:

1. **Information density:** Show useful data without clutter. Use progressive disclosure — summary on the dashboard, details on click.
2. **Visual hierarchy:** The most important information (today's plan, active tasks) is prominent. Secondary information (streaks, settings) is accessible but not dominant.
3. **Consistency:** Every card, button, and interaction follows the same patterns. A user who learns one section of the app automatically understands every other section.
4. **Whitespace:** Despite being information-dense, the dashboard uses consistent spacing to prevent the interface from feeling cramped.
5. **Personality:** The gradient accents, glow effects, and smooth animations give the dashboard character without sacrificing professionalism.
