---
name: CampusPulse Developer-Grade Hub
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#cac3d8'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#938ea1'
  outline-variant: '#484455'
  surface-tint: '#cbbeff'
  primary: '#cbbeff'
  on-primary: '#330098'
  primary-container: '#7952ff'
  on-primary-container: '#fff9ff'
  inverse-primary: '#6337e8'
  secondary: '#ffb690'
  on-secondary: '#552100'
  secondary-container: '#ec6a06'
  on-secondary-container: '#4a1c00'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#007f95'
  on-tertiary-container: '#f5fcff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e7deff'
  primary-fixed-dim: '#cbbeff'
  on-primary-fixed: '#1d0061'
  on-primary-fixed-variant: '#4b07d1'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#111317'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Space Grotesk
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  body-lg:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.375rem
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system bridges the hyper-technical precision of developer canvas tools (node schemas, API inspectors, terminal dashboards) with the kinetic, lively energy of a 24/7 college campus. Designed for university students, club executives, hackathon leads, and campus administrators, the platform delivers high-density efficiency alongside an electric visual identity.

### Emotional Target
- **Kinetic & Engaging:** Evoking the pulse, hype, and momentum of hackathons, campus rallies, and club socials.
- **Architectural Precision:** Inspiring confidence through node-graph clarity, strict alignments, monospaced metadata markers, and structured schema styling.
- **Unapologetically Dark & Tech-Forward:** Rejecting sterile academic software templates in favor of a sleek, dark terminal UI with high-contrast neon accents.

### Style Classification
- **Cyber-SaaS & Glassmorphic Precision:** Deep obsidian canvases textured with subtle dot grids, crisp semi-translucent glass panels, precision micro-borders (`1px` with low opacity), rounded pill status badges, and glowing electric violet and vivid amber endpoints.

## Colors

The palette is engineered around high luminance contrast on deep, light-absorbing obsidian foundations:

- **Primary (`#7952FF` - Electric Violet / Indigo):** Drives primary interactive states, selected tabs, canvas connectors, active filters, and primary CTA buttons. Delivers the intellectual and dynamic pulse of the brand.
- **Secondary (`#F97316` - Vivid Amber / Orange):** Directly adapted from the schema route endpoints (`/api/...`). Applied to registration alerts, countdown tickers, live status pills, capacity thresholds, and urgent calls to action.
- **Tertiary (`#06B6D4` - Cyber Cyan):** Utilized for student role badges, auxiliary telemetry, query params, and live web-socket connectivity indicators.
- **Neutral Base (`#0D0F12` - Deep Obsidian):** A near-black void foundation paired with elevated surface tokens:
  - Canvas / Root: `#0D0F12` with dot-matrix overlay (`rgba(255, 255, 255, 0.07)` on 24px pitch).
  - Surface Glass: `rgba(20, 24, 33, 0.72)` with a 12px backdrop blur.
  - Surface Card Elevated: `rgba(28, 33, 46, 0.85)`.
  - Border Hairline: `rgba(255, 255, 255, 0.08)` to `rgba(121, 82, 255, 0.35)` on hover.
  - Text Primary: `#F8FAFC` (pure readability).
  - Text Secondary: `#94A3B8` (subdued metadata).

## Typography

The typographic hierarchy combines three purpose-driven type families:

1. **Display & Headlines (`Space Grotesk`):** Provides a tech-forward, geometric posture with subtle eccentricities. Used across hero headers, modal titles, and event banner cards.
2. **Body & Interface (`Geist`):** Delivers clean readability for dense descriptions, schedule matrices, user profiles, and activity streams.
3. **Data, Tokens & Schema (`JetBrains Mono`):** Directly mirrors database fields, role indicators (`organizer_id`, `uuid`), timestamps (`timestamptz`), API methods (`GET`, `POST`), ticket serials, and room numbers.

## Layout & Spacing

The layout is built on a responsive 12-column grid system accompanied by an endless canvas schema viewport for event workflow mapping:

- **Desktop (1024px+):** 12-column grid, 1.5rem (`24px`) gutters, and 2rem outer margins. Dashboard sidebars collapse from expanded 260px docks to 64px micro-rails.
- **Tablet (768px - 1023px):** 8-column grid with 1rem gutters and 1.5rem margins. Schema diagrams transition into collapsible tiered nodes.
- **Mobile (<768px):** 4-column fluid layout with 1rem margins. Event grids switch to single-column swipeable cards, and role switchers anchor as bottom sticky segmented bars.
- **Node-Canvas Mode:** When inspecting event flow diagrams or spatial campus maps, the interface switches to a panning grid canvas governed by a `24px` Cartesian coordinate dot grid.

## Elevation & Depth

Depth is established through translucent dark layers and luminous edge refractions rather than traditional heavy drop shadows:

- **Layer 0 (Canvas Base):** `#0D0F12` with a radial dot-matrix pattern (`#2A2E39` dots on a 24px grid).
- **Layer 1 (Schema & Event Cards):** `rgba(20, 24, 33, 0.7)` with `backdrop-filter: blur(14px)`, an inner hairline outline (`1px solid rgba(255, 255, 255, 0.08)`), and an ambient drop shadow: `0 8px 32px -4px rgba(0, 0, 0, 0.5)`.
- **Layer 2 (Hover & Active States):** Transition to `rgba(28, 34, 48, 0.85)` with a boundary border tinted to the contextual role: `1px solid rgba(121, 82, 255, 0.45)` along with an electric soft perimeter glow: `0 0 20px -2px rgba(121, 82, 255, 0.25)`.
- **Layer 3 (Modals & Overlays):** `rgba(13, 15, 18, 0.92)` frosted glass with `20px` blur, bordered with `1px solid rgba(255, 255, 255, 0.15)`, cast against a darkened scrim of `rgba(5, 6, 8, 0.8)`.

## Shapes

The design uses a refined balance of structured geometric enclosures and smooth pill markers:

- **Containers & Glass Panels:** Follow `roundedness: 2` (base `8px` / `0.5rem`, `rounded-lg: 16px` / `1rem`), echoing modern database canvas nodes and developer console windows.
- **Pills & Status Micro-Badges:** Fully pill-shaped (`9999px` border-radius) for roles (`ADMIN`, `ORGANIZER`, `STUDENT`), HTTP status tags (`GET`, `POST`), and capacity counters.
- **Interactive Toggles & Segment Controls:** Inset pill capsules with a `6px` internal radius and `9999px` overall border track.

## Components

### Buttons
- **Primary Action (Electric CTA):** Solid `#7952FF` with `#FFFFFF` label text, `8px` radius, subtle top-highlight glow, and an interactive hover elevation casting a violet aura (`0 0 16px rgba(121, 82, 255, 0.5)`).
- **Secondary / Endpoint Action:** Translucent dark obsidian background with an orange hairline border (`1px solid rgba(249, 115, 22, 0.4)`), `#F97316` text, and orange micro-glow on hover.
- **Ghost / Utility:** Transparent fill, `JetBrains Mono` label, `#94A3B8` text, shifting to `#F8FAFC` with a `rgba(255, 255, 255, 0.06)` background fill on hover.

### Badges & Method Chips
- **HTTP & Role Chips:** Pill containers with uppercase `label-md` mono typography.
  - `GET / Public`: Deep purple fill (`rgba(121, 82, 255, 0.15)`), violet border (`rgba(121, 82, 255, 0.35)`), text `#A78BFA`.
  - `POST / Register`: Warm amber fill (`rgba(249, 115, 22, 0.15)`), orange border (`rgba(249, 115, 22, 0.4)`), text `#FB923C`.
  - `Capacity Indicator`: `#06B6D4` status tag with a live flashing pulse dot (`4px` diameter).

### Glassmorphic Event & Schema Cards
- Built with a header ribbon carrying schema iconography (table icon, vertical triple-dot actions), an inner row list with field key (`text-white`) and field data-type (`text-slate-500` mono, e.g., `uuid`, `timestamptz`), and connecting bezier node anchor points on left/right borders.

### Role Switcher Segment
- A glassmorphic tab rail containing role states (`Student`, `Club Lead`, `Admin`). The active state shifts with a sliding capsule background tinted in `#7952FF` with `0 2px 10px rgba(121, 82, 255, 0.3)`.

### Form Fields & Search Terminals
- Deep dark inset fill (`rgba(8, 10, 14, 0.8)`) with `1px solid rgba(255, 255, 255, 0.1)`. Focus state illuminates with a crisp `#7952FF` ring and an optional terminal prefix prompt symbol (`>_`).

### Data Tables & Event Matrices
- Alternating row zebra subtle shifts (`transparent` to `rgba(255, 255, 255, 0.02)`), mono headers with bottom border `1px solid rgba(255, 255, 255, 0.08)`, and interactive hover highlight across rows.