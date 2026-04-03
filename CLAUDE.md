# Ember

- Name: Ember
- Feel: Warm, calm, minimal, effective
- Purpose: To help users build healthier habits, gain insights into their current habits, and enable them to reach their goals through awareness
- Description: Ember is a calm, minimal daily wellness app for mood, energy, stress, movement, drink tracking, journaling, and gratitude. The tone is warm and personal — never clinical, never gamified aggressively.


---

## Architecture

- **Framework:** React Native 0.76+ with New Architecture enabled, via Expo SDK 52+
- **Navigation:** React Navigation v7 (stack + bottom tabs)
- **Client State:** Zustand (UI state, offline entry buffer)
- **Server State:** TanStack Query v5 (Supabase data fetching, caching, sync)
- **Backend:** Supabase (Postgres, Auth, Row Level Security, Edge Functions)
- **Charts:** Victory Native (sparklines, bar charts, mood trends)
- **Offline Storage:** MMKV (fast local key-value, used with Zustand persist middleware)
- **Notifications:** Expo Notifications (optional daily check-in reminders)

---

## Code Standards

- Functional components only. No class components.
- Custom hooks for ALL business logic — `useEntry`, `useStreaks`, `useMoodHistory`, `useAuth` etc.
- Barrel exports via `index.ts` in every feature folder.
- Error boundaries at route level minimum.
- No inline styles — always use `StyleSheet.create()`.
- Never hardcode color, spacing, radius, or shadow values — always import from `src/tokens/index.ts`.
- All Supabase queries go through `src/services/` — never call Supabase directly from a component.
- Always handle offline state — entries should write to MMKV first, sync to Supabase when online.
- Every user's data is protected by Supabase Row Level Security — never fetch data without an authenticated session.

---

## Design Tokens

## Color

### Base Palette

| Token | Hex | Usage |
|---|---|---|
| `cream` | `#FAF7F2` | App background, primary surface |
| `warm-white` | `#FFFDF9` | Card backgrounds, elevated surfaces |
| `stone` | `#8C8178` | Secondary text, labels, metadata |
| `ink` | `#2C2825` | Primary text, primary button background |
| `ink-soft` | `#5C5550` | Body text, secondary headings, hover state for ink |

### Sage (Primary Accent — Mood & Positivity)

| Token | Hex | Usage |
|---|---|---|
| `sage` | `#7A9E7E` | Mood metric, streak accents, italic highlights, active nav |
| `sage-light` | `#B5CEAB` | Avatar gradient, pulse dot, streak border |
| `sage-pale` | `#E8F0E4` | Card glow overlay, background tints |

### Amber (Secondary Accent — Warmth & Gratitude)

| Token | Hex | Usage |
|---|---|---|
| `amber` | `#D4956A` | Drinks metric, gratitude border-left, streak border |
| `amber-pale` | `#F5E6D8` | Gratitude card background gradient start |

### Tracker-Specific Colors

| Token | Hex | Usage |
|---|---|---|
| `energy-gold` | `#C9A84C` | Energy metric value, sparkline overlay line, streak border |
| `stress-red` | `#C97B7B` | Stress metric value |
| `blue-calm` | `#7B9EC9` | Movement metric value |

### Semantic Mappings

```
Background:        cream (#FAF7F2)
Surface / Card:    warm-white (#FFFDF9)
Surface / Inset:   cream (#FAF7F2)  ← used inside cards for metric tiles
Text / Primary:    ink (#2C2825)
Text / Secondary:  stone (#8C8178)
Text / Italic:     sage (#7A9E7E)
Border / Subtle:   rgba(44, 40, 37, 0.07)
```

---

## Typography

### Fonts

| Role | Family | Source |
|---|---|---|
| Display / Headings | `Playfair Display` | Google Fonts |
| Body / UI | `DM Sans` | Google Fonts |

```
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap
```

### Type Scale

| Role | Font | Size | Weight | Other |
|---|---|---|---|---|
| Screen greeting | Playfair Display | 26px | 400 | line-height 1.2 |
| Greeting italic accent | Playfair Display | 26px | 400 | italic, color: sage |
| Section title | Playfair Display | 17px | 400 | — |
| Metric value (large) | Playfair Display | 20px | 500 | line-height 1 |
| Streak count | Playfair Display | 26px | 500 | line-height 1 |
| Body / Button | DM Sans | 14px | 500 | letter-spacing 0.02em |
| Card label | DM Sans | 10px | 500 | uppercase, letter-spacing 0.14em |
| Metric label | DM Sans | 9px | 400 | uppercase, letter-spacing 0.08em |
| Sub-greeting | DM Sans | 11px | 500 | uppercase, letter-spacing 0.12em |
| Section link | DM Sans | 12px | 400 | color: stone |
| Streak name | DM Sans | 10px | 400 | uppercase, letter-spacing 0.06em |
| Insight pill text | DM Sans | 12.5px | 400 | line-height 1.5 |
| Gratitude entry | DM Sans | 13px | 400 | italic, line-height 1.5 |
| Week day labels | DM Sans | 9px | 400 | uppercase, letter-spacing 0.06em |

---

## Spacing

### Screen Layout

| Property | Value |
|---|---|
| Max content width | 390px (mobile frame) |
| Bottom padding (nav clearance) | 90px |
| Header top padding | 52px |
| Header horizontal padding | 28px |
| Section horizontal margin | 20px |
| Section vertical gap | 20px |

### Component Internals

| Component | Padding |
|---|---|
| Today card | 24px all sides |
| Insights card | 22px top/bottom, 20px left/right |
| Streak card | 16px top/bottom, 12px left/right |
| Metric tile | 12px top/bottom, 8px left/right |
| Primary button | 14px all sides |
| Gratitude entry | 12px top/bottom, 14px left/right |
| Insight pill | 10px top/bottom, 14px left/right |
| Bottom nav | 12px top, 24px bottom |

### Gap / Spacing Between Elements

| Context | Value |
|---|---|
| Metric tiles row gap | 8px |
| Streak cards row gap | 10px |
| Date strip item gap | 8px |
| Nav item gap (icon → label) | 4px |
| Metric icon margin-bottom | 4px |
| Metric label margin-top | 3px |
| Card label margin-bottom | 16px |
| Metrics row margin-bottom | 18px |
| Sparkline margin-top | 14px |
| Insight pill margin-top | 14px |

---

## Border Radius

| Token | Value | Used on |
|---|---|---|
| `radius-xl` | 24px | Today card, insights card, gratitude card |
| `radius-lg` | 18px | Streak cards |
| `radius-md` | 14px | Metric tiles, primary button, gratitude entries |
| `radius-sm` | 12px | Gratitude entries, add-gratitude button |
| `radius-pill` | 10px | Insight pill |
| `radius-full` | 50% | Avatar, date dots, pulse dot |

---

## Shadows

| Token | Value | Used on |
|---|---|---|
| `shadow-card` | `0 2px 20px rgba(44,40,37,0.07)` | Today card |
| `shadow-card-subtle` | `0 2px 20px rgba(44,40,37,0.06)` | Insights card |
| `shadow-streak` | `0 1px 10px rgba(44,40,37,0.05)` | Streak cards |
| `shadow-avatar` | `0 2px 12px rgba(122,158,126,0.3)` | Avatar (sage-tinted) |
| `shadow-gratitude-icon` | `0 1px 8px rgba(212,149,106,0.2)` | Gratitude icon (amber-tinted) |

**Pattern:** shadows are always ink-colored (`#2C2825`) at very low opacity (0.05–0.07), except on colored elements (avatar, gratitude icon) where the shadow picks up the element's own hue.

---

## Motion & Animation

### Named Animations

| Name | Definition | Usage |
|---|---|---|
| `fadeUp` | `from { opacity:0; transform:translateY(16px) }` `to { opacity:1; transform:translateY(0) }` | All major sections on page load |
| `pulse` | Scale 1→0.85, opacity 1→0.6, back | Live indicator dot on primary button |

### Transition Speeds

| Context | Value |
|---|---|
| Button background | `0.2s ease` |
| Button press scale | `0.1s` |
| Streak card hover lift | `0.2s ease` |
| Nav item opacity | `0.2s ease` |
| Date dot state change | `0.2s ease` |

### Staggered Load Delays

| Element | Delay |
|---|---|
| Today card | `0s` |
| Streaks section | `0.1s` |
| Insights card | `0.2s` |
| Gratitude card | `0.3s` |

### Interaction States

| Element | Hover | Active |
|---|---|---|
| Primary button | background → ink-soft | scale(0.98) |
| Streak card | translateY(-2px) | — |
| Nav item (inactive) | opacity 0.4 → 0.7 | — |
| Add-gratitude button | background rgba(amber, 0.07) | — |

---

## Tracker Color System

Each of the 5 trackers has a dedicated accent color used consistently across metric tiles, chart lines, and any streak accents.

| Tracker | Color Token | Hex |
|---|---|---|
| Mood | `sage` | `#7A9E7E` |
| Energy | `energy-gold` | `#C9A84C` |
| Stress | `stress-red` | `#C97B7B` |
| Movement | `blue-calm` | `#7B9EC9` |
| Drinks | `amber` | `#D4956A` |

---

## Surface Hierarchy

Ember uses three surface levels — never go deeper than this.

```
Level 0 — App background:   cream (#FAF7F2)  ← page bg, paper texture overlay
Level 1 — Cards:            warm-white (#FFFDF9)  ← today card, insights, streaks
Level 2 — Inset elements:   cream (#FAF7F2)  ← metric tiles sit inside Level 1 cards
```

---

## Texture

A subtle paper grain overlay sits on the entire app background using an SVG fractalNoise filter at **3% opacity**. This gives the cream background warmth and prevents it reading as flat white. Keep this on all screens.

```css
background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
  <filter id='noise'>
    <feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/>
    <feColorMatrix type='saturate' values='0'/>
  </filter>
  <rect width='300' height='300' filter='url(%23noise)' opacity='0.03'/>
</svg>");
```

In React Native, approximate this with a very low-opacity noise image overlay.

---

## Component Patterns

### Cards
- Background: `warm-white`
- Border radius: `radius-xl` (24px)
- Shadow: `shadow-card`
- No explicit border — shadow creates separation
- Accent cards (gratitude) use a gradient background instead: `linear-gradient(135deg, amber-pale, #FDF4EC)`

### Streak Accent Borders
Streak cards use a 3px solid top border in the relevant tracker color as their only color accent. All other sides have no border.

### Labels / Eyebrows
All section labels and metric labels use the same pattern: `9–11px`, uppercase, `letter-spacing 0.08–0.14em`, color `stone`. This creates visual hierarchy without weight.

### Primary Button
- Background: `ink`
- Text: white, DM Sans 14px weight 500
- Radius: `radius-md` (14px)
- Always full-width within its container
- Live pulse dot (sage-light) signals interactivity

### Navigation
- Fixed bottom, `backdrop-filter: blur(16px)` with semi-transparent cream background
- 5 items: Home, Journal, Insights, Streaks, Settings
- Active item: label turns `sage`, icon full opacity
- Inactive: 40% opacity

---

## React Native Token File

Paste this into `src/tokens/index.ts` to use across the app:

```typescript
export const colors = {
  // Base
  cream: '#FAF7F2',
  warmWhite: '#FFFDF9',
  stone: '#8C8178',
  ink: '#2C2825',
  inkSoft: '#5C5550',

  // Sage
  sage: '#7A9E7E',
  sageLight: '#B5CEAB',
  sagePale: '#E8F0E4',

  // Amber
  amber: '#D4956A',
  amberPale: '#F5E6D8',

  // Trackers
  energyGold: '#C9A84C',
  stressRed: '#C97B7B',
  blueCalm: '#7B9EC9',
} as const;

export const typography = {
  display: 'PlayfairDisplay-Regular',
  displayMedium: 'PlayfairDisplay-Medium',
  displayItalic: 'PlayfairDisplay-Italic',
  body: 'DMSans-Regular',
  bodyMedium: 'DMSans-Medium',
  bodyLight: 'DMSans-Light',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#2C2825',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  subtle: {
    shadowColor: '#2C2825',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
} as const;

export const trackerColors = {
  mood: colors.sage,
  energy: colors.energyGold,
  stress: colors.stressRed,
  movement: colors.blueCalm,
  drinks: colors.amber,
} as const;
```

## File Structure

```
src/
  features/
    checkin/          # Daily check-in flow (mood, energy, stress, movement, drinks)
    journal/          # Free-write journal entries
    gratitude/        # Gratitude prompts and entries
    insights/         # Weekly trends, sparklines, correlations
    streaks/          # Streak calculation and display
    auth/             # Login, signup, session management
  shared/
    components/       # Reusable UI (Card, Button, MetricTile, etc.)
    hooks/            # Shared hooks (useOnline, useCurrentUser, etc.)
    utils/            # Helpers (date formatting, streak math, etc.)
  navigation/         # React Navigation config, tab and stack definitions
  services/
    supabase.ts       # Supabase client init
    entries.ts        # Entry CRUD operations
    auth.ts           # Auth helpers
    streaks.ts        # Streak calculation service
  tokens/
    index.ts          # All design tokens (colors, spacing, radius, shadows, fonts)
  styles/
    global.ts         # Shared StyleSheet patterns (cardStyle, buttonStyle, etc.)
  types/
    index.ts          # Global TypeScript types (Entry, MoodScore, StreakData, etc.)
```

---

## Supabase Data Model

**Tables:**
- `profiles` — user profile, display name, preferences, drink limit setting
- `entries` — one row per day per user (mood, energy, stress, movement, drinks, journal text)
- `gratitude_items` — multiple rows per day per user (each gratitude note is a separate row)

**Key rules:**
- All tables have Row Level Security enabled — users can only read/write their own rows
- `entries` has a unique constraint on `(user_id, date)` — use upsert, not insert
- Streak calculations run in `src/services/streaks.ts` client-side from cached TanStack Query data
- Edge Functions handle weekly insight generation (mood averages, correlation detection)

---

## Testing

- **Unit/Component:** Jest + React Native Testing Library
- **Test files:** Colocated with component — `Component.test.tsx`
- **E2E:** Detox for critical flows (check-in, auth, streak persistence)
- Always test offline → online sync behavior for entry submission

---

## Commands

```bash
# Start dev server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run tests
jest --watchAll

# Type check
tsc --noEmit

# Lint
eslint . --fix

# Build for production (EAS)
eas build --platform all
```

---

## Key Behaviours to Always Preserve

- **Offline first:** Entry submission writes locally before attempting Supabase sync
- **Upsert not insert:** Today's entry is always an upsert on `(user_id, date)`
- **Warm tone:** UI copy should always be gentle and encouraging — no harsh streak failure messages
- **Staggered animations:** Screen sections fade up with 0.1s stagger delays on load
- **Paper texture:** The subtle grain overlay on `cream` background should appear on every screen
