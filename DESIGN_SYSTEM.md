# GraphicCity — Design System

**Philosophy:** Apple's design philosophy applied to a creative studio brand. Clarity, deference, depth. Every component defers to content. Every interaction feels inevitable.

---

## 1. Buttons

### Design Principles
- Buttons are typographic before they are shapes. The text is the primary signal; the container is secondary.
- One shape. One consistent radius. Variations come from hierarchy, not geometry.
- Never use uppercase for button text. Sentence case only.

---

### 1.1 Primary Button

The workhorse. Used for the single most important action on any surface.

| Property | Light Mode | Dark Mode |
|---|---|---|
| Background | Core Black `#0A0A0A` | Core White `#FFFFFF` |
| Text color | Core White `#FFFFFF` | Core Black `#0A0A0A` |
| Border | None | None |
| Shadow | `0 1px 2px rgba(0,0,0,0.08)` | `0 1px 2px rgba(0,0,0,0.15)` |

| Property | Value |
|---|---|
| Typography | Inter Medium, 15px |
| Height | 44px |
| Horizontal padding | 24px (left), 24px (right) |
| Border radius | `radius-md` — 8px |
| Icon margin (if icon present) | 8px (right of icon, left of text) |
| Transition | All properties, 150ms, ease-out |

**States:**

| State | Change |
|---|---|
| Default | As above |
| Hover | Background shifts to Stone 800 (`#262626`). Light mode only. Dark mode: background shifts to Stone 200 (`#E5E5E5`). |
| Active | Scale 0.97. Background darkens by one step. |
| Focus | Focus ring: 2px solid Signal Blue (`#0066FF`), offset 2px. |
| Disabled | Opacity 0.35. No hover effect. No shadow. Cursor not-allowed. |
| Loading | Text hidden. 16px spinner appears centered. Width preserved. |

---

### 1.2 Secondary Button

For actions that matter but are not primary.

| Property | Light Mode | Dark Mode |
|---|---|---|
| Background | Transparent | Transparent |
| Text color | Core Black `#0A0A0A` | Core White `#FFFFFF` |
| Border | 1px solid Stone 300 (`#D4D4D4`) | 1px solid Stone 600 (`#525252`) |
| Shadow | None | None |

All dimensions match Primary (44px height, 8px radius, 15px Inter Medium, 24px padding).

**States:**

| State | Change |
|---|---|
| Default | As above |
| Hover | Border shifts to Stone 500 (`#737373`). Background becomes Stone 100 (`#F5F5F5`). Dark mode: border to Stone 400, background to Stone 800. |
| Active | Scale 0.97. Background darkens. |
| Focus | Signal Blue ring, 2px, offset 2px. |
| Disabled | Opacity 0.35. Border remains. No hover. |

---

### 1.3 Ghost Button

For tertiary actions. Minimal footprint.

| Property | Light Mode | Dark Mode |
|---|---|---|
| Background | Transparent | Transparent |
| Text color | Stone 500 (`#737373`) | Stone 400 (`#A3A3A3`) |
| Border | None | None |

| Property | Value |
|---|---|
| Typography | Inter Regular, 14px |
| Height | Auto (text-height only) |
| Padding | 4px horizontal, 2px vertical (text only) |
| Border radius | None (text is not a container) |

**States:**

| State | Change |
|---|---|
| Default | As above |
| Hover | Text color to Core Black. Dark mode: text color to Core White. |
| Active | Opacity 0.7. |
| Focus | Underline appears. 1px, color matches text. |
| Disabled | Opacity 0.3. |

---

### 1.4 Button Sizes

| Size | Height | Font | Padding H | Icon Size |
|---|---|---|---|---|
| Small | 36px | Inter Medium 13px | 16px | 14px |
| Default | 44px | Inter Medium 15px | 24px | 16px |
| Large | 52px | Inter Medium 17px | 32px | 18px |

---

### 1.5 Icon Button

For actions represented entirely by an icon.

| Property | Value |
|---|---|
| Width / Height | 44px × 44px (default) |
| Icon size | 18px |
| Radius | 8px |
| Background | Transparent |
| Hover | Background: Stone 100 (`#F5F5F5`). Dark mode: Stone 800 (`#262626`). |
| Active | Background: Stone 200 |
| Focus | Signal Blue ring |

Sizes: Small (36px, icon 14px), Default (44px, icon 18px), Large (52px, icon 22px).

---

## 2. Inputs

### Design Principles
- Inputs are perceived as surfaces, not lines. They sit on the canvas with a subtle container.
- Focus states are deliberate, not aggressive. A blue ring, not a full glow.
- Labels are always visible. Never use placeholder text as a label.
- Error states are descriptive. Color alone is insufficient.

---

### 2.1 Text Input

| Property | Light Mode | Dark Mode |
|---|---|---|
| Background | Stone 50 (`#FAFAFA`) | Stone 900 (`#171717`) |
| Border | 1px solid Stone 300 (`#D4D4D4`) | 1px solid Stone 700 (`#404040`) |
| Text color | Core Black (`#0A0A0A`) | Core White (`#FFFFFF`) |
| Placeholder color | Stone 400 (`#A3A3A3`) | Stone 500 (`#737373`) |
| Shadow | None | None |

| Property | Value |
|---|---|
| Height | 44px |
| Horizontal padding | 16px |
| Border radius | 8px |
| Typography | Inter Regular, 15px |
| Label typography | Inter Medium, 13px, Stone 500 |
| Label margin bottom | 6px |
| Helper text typography | Inter Regular, 12px, Stone 400 |
| Helper margin top | 4px |
| Transition | Border-color 150ms ease-out, box-shadow 150ms ease-out |

**States:**

| State | Change |
|---|---|
| Default | As above |
| Hover | Border to Stone 400 (`#A3A3A3`). Dark mode: border to Stone 500 (`#737373`). |
| Focus | Border to Signal Blue (`#0066FF`). Add focus ring: 0 0 0 2px rgba(0,102,255,0.15). |
| Active (typing) | Same as focus. Cursor is a 2px-wide bar. |
| Disabled | Opacity 0.4. No hover or focus changes. Cursor not-allowed. |
| Error | Border to Signal Red (`#DC2626`). Focus ring: 0 0 0 2px rgba(220,38,38,0.15). Error text below. |
| Success | Border to Signal Green (`#059669`). Pulse briefly on validation (opacity pulse over 300ms). |

**With icon:**
- Icon inside input, left-aligned. 16px icon. 12px from left edge.
- Text padding-left: 40px (16px icon + 12px left + 12px icon-text gap).

---

### 2.2 Textarea

Same visual system as text input, but:

| Property | Value |
|---|---|
| Min height | 120px |
| Padding | 16px |
| Resize | Vertical only, custom handle: 8px × 8px square in bottom-right, Stone 300. |
| Character count | Bottom-right, Inter Regular 11px, Stone 400. |

---

### 2.3 Select

Same visual system as text input but includes a chevron icon (16px) positioned at the right edge with 12px padding.

| Property | Value |
|---|---|
| Chevron color | Stone 400 |
| Chevron rotation | 0deg default, 180deg on open |
| Options panel | Dropdown appears 4px below input. Radius 8px. Shadow `shadow-lg`. Max height 240px with overflow scroll. Option height 36px, padding 12px 16px, Inter Regular 14px. Hover: background Stone 100. Dark mode hover: Stone 800. |

---

### 2.4 Form Composition

| Element | Spacing |
|---|---|
| Between fields | 24px |
| Field group (related) | 16px between, 24px group padding top |
| Submit button from last field | 32px |
| Label to field | 6px |
| Helper to field | 4px |
| Error to field | 4px |

Form max-width: 480px (single column), 720px (two columns).

---

## 3. Cards

### Design Principles
- Cards are subtle. They do not float aggressively. They sit on the surface with a gentle shadow.
- No rounded corners larger than 12px for standard cards.
- Cards communicate hierarchy through elevation, not color.

---

### 3.1 Basic Card

| Property | Light Mode | Dark Mode |
|---|---|---|
| Background | Core White `#FFFFFF` | Stone 900 `#171717` |
| Border | 1px solid Stone 200 (`#E5E5E5`) | 1px solid Stone 800 (`#262626`) |
| Shadow | None | None |
| Radius | 8px | 8px |
| Padding | 24px | 24px |

---

### 3.2 Interactive Card (hoverable, clickable)

| Property | Light Mode | Dark Mode |
|---|---|---|
| Background | Core White | Stone 900 |
| Border | 1px solid Stone 200 | 1px solid Stone 800 |
| Shadow | `shadow-sm` | `shadow-sm` with black-only color |
| Radius | 8px | 8px |
| Padding | 24px | 24px |
| Hover elevation | `shadow-md` | `shadow-md` |
| Hover border | Stone 300 | Stone 700 |
| Hover transform | TranslateY(-2px), 200ms ease-out | Same |
| Active transform | TranslateY(0px), scale(0.99) | Same |

---

### 3.3 Elevated Card

For modals, dialogs, floating panels.

| Property | Light Mode | Dark Mode |
|---|---|---|
| Background | Core White | Stone 900 |
| Border | None | 1px solid Stone 800 |
| Shadow | `shadow-lg` | `shadow-xl` (black-only, higher opacity) |
| Radius | 12px | 12px |
| Padding | 32px | 32px |

---

## 4. Navigation

### Design Principles
- Navigation is an anchor, not a distraction. It sits quietly at the top.
- No background by default. It appears as needed on scroll.
- The CTA button is the only visually emphasized nav element.
- Mobile navigation is a full-screen overlay, not a hamburger drawer.

---

### 4.1 Primary Navigation (Header)

| Property | Value |
|---|---|
| Height | 64px |
| Background | Transparent (default). `rgba(255,255,255,0.85)` with `backdrop-filter: blur(20px)` on scroll (light mode). Dark mode: `rgba(10,10,10,0.85)`. |
| Border-bottom | None at top. 1px solid Stone 200 on scroll (light). Stone 800 (dark). |
| Transition | Background 300ms ease-out. Border 300ms ease-out. |

**Layout:**

```
[Logo — 16px height]  ......  [Work] [Capabilities] [About] [Journal]  ......  [Start a Project]
```

| Element | Spec |
|---|---|
| Logo | Height 16px. Width auto. Vertically centered. |
| Nav links | Inter Regular, 14px, Core Black / Core White. 24px gap between links. |
| CTA button | Primary Button, Small size (36px). |
| Left/right padding | 32px (desktop), 20px (tablet), 16px (mobile). |
| Link hover | Opacity 0.7. No underline. No color shift. Subtle. |
| Active link (current page) | Inter Medium instead of Regular. |

**Scroll behavior:**
- At top of page: Transparent background. No border. Logo and links are white on hero sections, black on light sections.
- After 100px scroll: Frosted background appears. Border appears. CTA button remains.

---

### 4.2 Mobile Navigation

| Property | Value |
|---|---|
| Trigger | Hamburger icon (24×24, three 2px lines, 6px apart, rounded 1px). Or "Menu" text link. |
| Overlay background | Core Black at 0.98 opacity. `backdrop-filter: blur(40px)`. |
| Overlay transition | Opacity 0→1 over 300ms ease-out. |
| Nav items | ABC Social Regular, 40px. White. 24px gap between items. |
| CTA in overlay | Primary button, Large size. White background, black text. |
| Close | "Close" text link or X icon in top-right. 16px from edges. |

---

### 4.3 Footer Navigation

See Section 5 (Footer).

---

## 5. Footer

### Design Principles
- The footer is a destination, not an afterthought. It should feel like the closing credits of a film.
- Three-column structure. Left: identity. Center: navigation. Right: contact + social.
- No massive link lists. Curated and minimal.

---

| Section | Content |
|---|---|
| Left | Logo (20px height) + tagline in Inter Regular 14px Stone 400. Copyright below: Inter Regular 12px Stone 400. |
| Center | Column 1: Work, Capabilities. Column 2: About, Journal. Links: Inter Regular 14px, Core Black / Core White. 12px gap between links, 32px between columns. |
| Right | Email (Inter Regular 14px, Core Black / Core White). Location (Inter Regular 12px, Stone 400). Social links (Inter Medium 12px, +0.06em tracking, uppercase, Stone 500). 16px gap between items. |

| Property | Value |
|---|---|
| Background | Stone 50 (`#FAFAFA`) / Stone 950 (`#0A0A0A`) |
| Border top | 1px solid Stone 200 / Stone 800 |
| Padding top | 80px |
| Padding bottom | 48px |
| Horizontal padding | 48px (desktop), 24px (mobile) |
| Max-width | 1280px inner container, centered |
| CTA row | Above the three columns: "Start a Project" link in ABC Social Regular 28px, with a rightward arrow. Bottom border treatment on hover. |

---

## 6. Badges

### Design Principles
- Badges are small, quiet, informational. They never compete with primary content.
- Pill shape (radius-full). Single line of text.
- Used for status, counts, metadata.

| Property | Value |
|---|---|
| Height | 20px |
| Horizontal padding | 8px |
| Radius | `radius-full` (9999px) |
| Typography | Inter Medium, 11px, +0.03em tracking |
| Icon (if present) | 10px, same color as text, 4px from left edge |

| Variant | Background | Text Color | Border |
|---|---|---|---|
| Default | Stone 200 / Stone 800 | Stone 700 / Stone 300 | None |
| Brand | Signal Blue at 0.12 opacity | Signal Blue | None |
| Success | Signal Green at 0.12 opacity | Signal Green | None |
| Warning | Warm Amber at 0.12 opacity | Warm Amber | None |
| Error | Signal Red at 0.12 opacity | Signal Red | None |
| Outline | Transparent | Stone 500 / Stone 400 | 1px Stone 300 / Stone 700 |

---

## 7. Tags

### Design Principles
- Tags are larger than badges. They represent filterable categories or skills.
- Subtle background. No emphasis beyond the text itself.

| Property | Value |
|---|---|
| Height | 28px |
| Horizontal padding | 12px |
| Radius | 6px (slightly softer than inputs, harder than pills) |
| Typography | Inter Regular, 13px |
| Icon margin | 6px (if present) |
| Dismiss (X) | 12px icon, 4px right margin, opacity 0.5 on default, 1.0 on hover |

| Variant | Background | Text Color | Border |
|---|---|---|---|
| Default | Stone 100 / Stone 800 | Stone 600 / Stone 400 | None |
| Active/Selected | Core Black / Core White | Core White / Core Black | None |
| Hover (interactive) | Stone 200 / Stone 700 | Core Black / Core White | None |

---

## 8. Portfolio Card

### Design Principles
- The work is the hero. The card is a frame, nothing more.
- No text overlay on the thumbnail. Text lives beneath.
- Hover reveals nothing — the thumbnail is already the full statement. Cursor changes to indicate clickability.

| Property | Value |
|---|---|
| Aspect ratio | 4:3 (standard), 16:9 (hero/featured) |
| Radius | 8px |
| Border | None |
| Shadow | None (flat) |
| Hover | Image scale 1.02 over 300ms ease-out. No overlay. No text reveal. |
| Cursor | Pointer |

**Text below thumbnail:**

| Element | Typography | Color (Light / Dark) |
|---|---|---|
| Project name | Inter Medium, 16px | Core Black / Core White |
| Discipline | Inter Regular, 13px | Stone 500 / Stone 400 |
| Year | Inter Regular, 13px | Stone 400 / Stone 500 |
| Gap between image and text | 16px | — |
| Gap between title and meta | 4px | — |

**Grid layout:**
- 3 columns (desktop), 2 (tablet), 1 (mobile).
- Column gap: 24px. Row gap: 40px.

---

## 9. Project Card

### Design Principles
- The project card is larger than a portfolio card. It includes a summary and is used on the Work page or as a featured section on the homepage.
- It should tell enough to create interest, not enough to satisfy it.

| Property | Value |
|---|---|
| Aspect ratio | 16:9 or 3:2 |
| Radius | 8px |
| Shadow | None |
| Hover | Scale 1.015 over 400ms ease-out. Subtle shadow appears: `shadow-md`. |

**Content below thumbnail (or in a right-side panel for horizontal layout):**

| Element | Spec |
|---|---|
| Client name | Inter Medium, 12px, +0.06em tracking, uppercase, Stone 500 / Stone 400 |
| Project title | ABC Social Regular, 28px, Core Black / Core White |
| Summary | Inter Regular, 14px, Stone 500 / Stone 400, max 3 lines |
| Tags | 2–3 discipline tags. |
| CTA | "View case study" — Ghost Button style. Arrow icon on hover. |
| Gap thumbnail to text | 24px |
| Gap title to summary | 8px |
| Gap summary to tags | 16px |
| Gap tags to CTA | 20px |

---

## 10. Testimonials

### Design Principles
- Testimonials are typographic first. No photo bubbles. No star ratings.
- The quote is the hero. Attribution is secondary.
- Use generous quotation marks as typographic elements (not icons).

---

### 10.1 Standard Testimonial

| Element | Spec |
|---|---|
| Opening quote mark | ABC Social Light, 72px, Stone 200 / Stone 700, opacity 0.5. Floated top-left. |
| Quote text | Inter Regular, 18px, 32px line-height, Core Black / Core White. 40px max-width. |
| Attribution name | Inter Medium, 14px, Core Black / Core White |
| Attribution title | Inter Regular, 13px, Stone 500 |
| Attribution company | Inter Regular, 13px, Stone 400 |
| Gap quote mark to text | 8px |
| Gap text to attribution | 24px |
| Gap name to title | 2px |

**Layout:** Centered block. Narrow column (640px max). No border, no card, no background.

---

### 10.2 Featured Testimonial (Hero)

Same as standard but larger:

| Element | Spec |
|---|---|
| Quote text | Inter Regular, 24px, 36px line-height |
| Opening quote mark | ABC Social Light, 96px |
| Attribution name | Inter Medium, 16px |

Used on homepage or landing pages. May include a background treatment: Stone 50 / Stone 900.

---

## 11. Accordions

### Design Principles
- Clean, border-only separation. No card containers.
- The chevron is the only decorative element.
- Content should animate height, not appear instantly.

| Property | Value |
|---|---|
| Border | 1px solid Stone 200 / Stone 800. Only between items (no outer border). |
| Label | Inter Regular, 16px, Core Black / Core White |
| Chevron | 16px icon, Stone 400. Rotates 180deg on open. |
| Label padding | 16px 0px |
| Content padding | 0px 0px 20px 0px |
| Content typography | Inter Regular, 14px, 24px line-height, Stone 500 / Stone 400 |
| Content max-width | 560px |
| Animation | Height transition 250ms ease-out. Opacity transition on content: 0→1 over 200ms, delayed 50ms after height begins. |
| Hover | Label color shifts to Stone 700 / Stone 300. No background. |

**State:**
- Default: Chevron at 0deg. Content hidden (height 0, opacity 0).
- Open: Chevron at 180deg. Content at full height (animated).

**Group behavior:** Only one accordion open at a time. Closing one before opening the next creates a sequential feel.

---

## 12. Pricing Cards

### Design Principles
- Transparent pricing. No hidden tiers. No "Contact us" for the real price.
- Three tiers maximum. The middle tier is visually emphasized (the "best value").
- Features are listed as text with check icons. No long lists.

---

| Property | Value |
|---|---|
| Card width | 320px (standard), 360px (featured/highlighted) |
| Radius | 12px |
| Background | Stone 50 / Stone 900 |
| Border | 1px solid Stone 200 / Stone 800 |
| Shadow | None |
| Padding | 32px |

**Featured tier (center):**
| Property | Value |
|---|---|
| Border | 1px solid Core Black / Core White |
| Shadow | `shadow-lg` |
| Scale | 1.04 (subtle visual lift) |
| Badge | "Most popular" — Default badge, centered above card. |

**Content structure (top to bottom):**

| Element | Spec |
|---|---|
| Tier name | Inter Medium, 14px, +0.06em, uppercase, Stone 500 |
| Price | ABC Social Light, 56px, Core Black / Core White. Monthly/annual label: Inter Regular 14px Stone 400 beside or below. |
| Description | Inter Regular, 14px, Stone 500, 2 lines max |
| Feature list | Inter Regular, 14px, Stone 600 / Stone 400. 14px check icon (Signal Green). 12px gap between items. 8px icon-text gap. 24px top margin from description. |
| CTA Button | Full-width Primary Button. Featured tier: Core Black bg with Core White text. Other tiers: Secondary Button. |
| Gap price to description | 8px |
| Gap description to features | 24px |
| Gap features to CTA | 32px |

---

## 13. Forms

### Design Principles
- One column. Always. Multi-column forms break reading flow.
- Labels above inputs. Never inline.
- Submit action is a Primary Button, full-width on mobile, left-aligned on desktop.
- Group related fields with subtle spacing, not fieldset borders.

**Full form composition:**

```
┌─────────────────────────────────────────────┐
│  Form Title (ABC Social Regular, 28px)       │
│  Description (Inter Regular, 14px, Stone 400)│
│                                              │
│  Label                                       │
│  ┌─────────────────────────────────────┐     │
│  │ Input                              │     │
│  └─────────────────────────────────────┘     │
│  Helper text                                  │
│                                              │
│  Label                                       │
│  ┌─────────────────────────────────────┐     │
│  │ Input                              │     │
│  └─────────────────────────────────────┘     │
│                                              │
│  ── horizontal divider (optional) ──          │
│                                              │
│  Label                                       │
│  ┌─────────────────────────────────────┐     │
│  │ Textarea                           │     │
│  │                                     │     │
│  └─────────────────────────────────────┘     │
│                                              │
│  [✓] Checkbox label (Inter Regular 14px)     │
│                                              │
│  ┌──────────────────────────────┐            │
│  │     Submit / Send            │            │
│  └──────────────────────────────┘            │
└─────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Form max-width | 560px |
| Section gap | 32px (between form groups) |
| Divider | 1px solid Stone 200 / Stone 800, 16px margin top and bottom |
| Checkbox | 18px × 18px square, 4px radius, border 1.5px Stone 400. Checked: Signal Blue bg, white checkmark. Label gap: 10px. |
| Radio | Same as checkbox but 18px circle. Selected: Signal Blue fill, 6px inner dot, white stroke. |
| Toggle | 36px × 20px. Track radius 10px. Stone 300 bg. Active: Signal Blue. Knob: 16px circle, white, shadow-sm. Transition: 200ms ease-out. |

---

## 14. Icons

### Design Principles
- Icons are functional, not decorative. If an icon needs explanation, use text instead.
- Consistent stroke weight across the entire system.

| Property | Value |
|---|---|
| Style | Outlined |
| Stroke weight | 1.5px |
| Cap shape | Rounded (round cap, round join) |
| Grid | 24×24px with 2px internal padding |
| Sizes | 14px (inline), 16px (input), 18px (button), 24px (standalone), 32px (section headers) |
| Color | Inherits from parent text color. Never hardcoded to a specific hex. |
| Filled variants | None in UI. Reserved for status (checked, active). |

**System icons (minimum set):**
- Chevron (down, up, left, right)
- X (close, dismiss)
- Check
- Plus / Minus
- Arrow (right, up-right, long-right)
- Menu / Hamburger
- Search
- External link
- Alert / Info
- Spinner / Loader

---

## 15. Empty States

### Design Principles
- An empty state is not an error. It is an invitation.
- No sad faces, no "oops," no broken illustrations.
- Clear explanation + one clear next action.

| Element | Spec |
|---|---|
| Illustration or icon | 48px icon or abstract geometric illustration (monochrome). Centered. |
| Headline | ABC Social Regular, 22px, Core Black / Core White, centered. |
| Description | Inter Regular, 14px, Stone 500 / Stone 400, centered, 400px max-width. |
| CTA | One Primary or Secondary button below description. |
| Gap icon to headline | 24px |
| Gap headline to description | 8px |
| Gap description to CTA | 24px |
| Vertical centering | Full container height. The empty state is always vertically centered in its available space. |

**Example:**
```
         [ icon ]
    No projects yet
  Your portfolio will appear here once you
       publish your first project.
       [ Create your first project ]
```

---

## 16. Loading States

### Design Principles
- Loading is not a blockage. It should feel like performance, not waiting.
- Skeleton screens for known layout structures. Spinner for actions.
- No spinning circles in brand colors. The spinner is a single thin ring.

---

### 16.1 Skeleton Screen

| Property | Value |
|---|---|
| Shape | Matches the content block it replaces |
| Color | Stone 200 / Stone 800 |
| Animation | Shimmer: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)` sweeping across over 1.5s, repeated. Dark mode: rgba(255,255,255,0.05). |
| Radius | Same as the component it replaces |

Skeleton variants:
- **Text line:** Height 14px, radius 4px, width 80% of container.
- **Card:** Same dimensions as card, 8px radius.
- **Avatar:** 40px circle.
- **Image:** Same aspect ratio as target image, 8px radius.

---

### 16.2 Spinner

| Property | Value |
|---|---|
| Shape | Single ring, 2px thick |
| Size | 16px (inline), 20px (button), 24px (section), 32px (page) |
| Color | Stone 400. One arc has Core Black / Core White opacity for direction. |
| Animation | Rotate 360deg over 800ms, linear, infinite. |
| Ring gap | 90deg (three-quarters ring) |

---

### 16.3 Page Loading

| Property | Value |
|---|---|
| Treatment | Skeleton screen for known content. Centered spinner for unknown. |
| Transition | Content fades in over 300ms once loaded. Skeleton fades out over 200ms. |
| Minimum display time | 300ms (prevents flash-of-content on fast loads). |

---

## 17. Hover States (Comprehensive)

| Element | Hover Effect | Duration | Easing |
|---|---|---|---|
| Primary button | Background darkens one step | 150ms | ease-out |
| Secondary button | Border darkens + subtle bg fill | 150ms | ease-out |
| Ghost button | Text color to solid black/white | 150ms | ease-out |
| Text link | Opacity 0.7 (no underline) | 150ms | ease-out |
| Text link (in content) | Underline appears, 1px, currentColor | 200ms | ease-out |
| Interactive card | TranslateY(-2px) + shadow increase | 200ms | ease-out |
| Portfolio card thumbnail | Image scale 1.02 | 300ms | ease-out |
| Input | Border darkens one step | 150ms | ease-out |
| Tag (interactive) | Background darkens | 100ms | ease-out |
| Accordion label | Text darkens | 100ms | ease-out |
| Nav link | Opacity 0.7 | 150ms | ease-out |
| Icon button | Background appears (Stone 100/800) | 150ms | ease-out |
| Close/dismiss | Opacity 0.5 → 1.0 | 100ms | ease-out |
| CTA button (primary) | Background darkens | 150ms | ease-out |
| Client name (trust list) | Weight Regular → Medium | 100ms | instant-weight (no animation, just shift) |
| Footer link | Opacity 0.7 | 150ms | ease-out |
| Menu item | Opacity 0.7 | 150ms | ease-out |
| Social icon | Opacity 0.7 | 150ms | ease-out |

---

## 18. Focus States (Comprehensive)

### Design Principles
- Focus is always visible. Never `outline: none` without a replacement.
- Focus ring is 2px solid Signal Blue, offset 2px from the element.
- All interactive elements receive focus. No exceptions.

| Element | Focus Style | Additional |
|---|---|---|
| Button | 2px solid Signal Blue, offset 2px | Border radius matches button |
| Input | 2px solid Signal Blue, offset 2px | Input border also turns blue |
| Textarea | Same as input | — |
| Select | Same as input | Dropdown chevron also turns blue |
| Checkbox | 2px Signal Blue ring, offset 1px | — |
| Radio | Same as checkbox | — |
| Toggle | 2px Signal Blue ring, offset 1px | — |
| Link | 1px underline + 2px Signal Blue ring on outer edge | — |
| Card (interactive) | 2px Signal Blue ring, offset 2px | Focus visible only on tab, not click |
| Tag (interactive) | 2px Signal Blue ring, offset 1px | — |
| Accordion trigger | 2px Signal Blue ring, offset 1px | Applied to the label area |
| Menu item | 2px Signal Blue ring, offset 1px | In overlay menu |
| Close button | Same as icon button | — |
| Icon button | 2px Signal Blue ring, offset 2px | — |

**Focus-visible only:** Use `:focus-visible` for elements that should only show the ring when focused via keyboard (cards, complex interactive areas). Use `:focus` for form elements and buttons.

---

## 19. Light Mode (Global System)

| Token | Value |
|---|---|
| Page background | Core White `#FFFFFF` |
| Canvas/alt background | Stone 50 `#FAFAFA` |
| Surface background | Core White `#FFFFFF` |
| Elevated surface | Core White `#FFFFFF` |
| Primary text | Core Black `#0A0A0A` |
| Secondary text | Stone 500 `#737373` |
| Tertiary text | Stone 400 `#A3A3A3` |
| Border | Stone 200 `#E5E5E5` |
| Border hover | Stone 300 `#D4D4D4` |
| Focus ring | Signal Blue `#0066FF` at 0.3 opacity ring |
| Frosted glass | `rgba(255,255,255,0.85)` + `backdrop-filter: blur(20px)` |
| Shadow color | `rgba(0,0,0,...)` — varies by shadow token |
| Selection color | Signal Blue at 0.2 opacity |
| Scrollbar | Track: transparent. Thumb: Stone 300, radius-full, 6px width. |

---

## 20. Dark Mode (Global System)

| Token | Value |
|---|---|
| Page background | Core Black `#0A0A0A` |
| Canvas/alt background | Stone 950 `#0A0A0A` (same as page, subtle shift via border instead) |
| Surface background | Stone 900 `#171717` |
| Elevated surface | Stone 800 `#262626` |
| Primary text | Core White `#FFFFFF` |
| Secondary text | Stone 400 `#A3A3A3` |
| Tertiary text | Stone 500 `#737373` |
| Border | Stone 800 `#262626` |
| Border hover | Stone 700 `#404040` |
| Focus ring | Signal Blue `#0066FF` at 0.4 opacity ring |
| Frosted glass | `rgba(10,10,10,0.85)` + `backdrop-filter: blur(20px)` |
| Shadow color | `rgba(0,0,0,0.4)` — deeper shadow in dark mode |
| Selection color | Signal Blue at 0.3 opacity |
| Scrollbar | Track: transparent. Thumb: Stone 700, radius-full, 6px width. |

**Dark mode specific rules:**
- Pure black (`#000000`) is never used as a background. It creates halation. Use `#0A0A0A` or `#171717`.
- Pure white (`#FFFFFF`) is never used on dark backgrounds. Use `#F5F5F5` for large type, `#E5E5E5` for body.
- Shadows in dark mode use pure black (`rgba(0,0,0,0.4+)`) — the darker the surface, the more the shadow disappears.
- Images should not be inverted. They should be treated with respect — if an image looks bad in dark mode, add a subtle white stroke or shadow to separate it from the dark background.
- Dark mode is not an afterthought. It is designed simultaneously with light mode.

---

## 21. Motion System

### Duration Tokens

| Token | Value | Usage |
|---|---|---|
| `motion-instant` | 50ms | Micro feedback (key press, toggle) |
| `motion-fast` | 100ms | Hover, active states |
| `motion-base` | 200ms | Focus transitions, color shifts |
| `motion-slow` | 300ms | Panel opens, page transitions |
| `motion-expressive` | 500ms | Hero entries, modal opens |
| `motion-narrative` | 700ms | Scroll-driven reveals, full-page transitions |

### Easing Tokens

| Token | Value | Usage |
|---|---|---|
| `ease-out` | `cubic-bezier(0.25, 0.01, 0.25, 1)` | All UI transitions |
| `ease-in-out` | `cubic-bezier(0.45, 0, 0.15, 1)` | Page transitions, modals |
| `ease-spring` | `cubic-bezier(0.25, 0.01, 0.15, 1.2)` | Overshoot effect (hero, reveal) |
| `linear` | `cubic-bezier(0, 0, 1, 1)` | Spinners, ambient motion |

### Stagger System

| Context | Delay |
|---|---|
| Menu items appearing | 60ms between items |
| Grid items entering | 80ms between items |
| Form fields revealing | 50ms between fields |
| Accordion content | 50ms after height open |
| Text characters (hero) | 40ms between characters |

---

## 22. Breakpoints

| Name | Width | Layout |
|---|---|---|
| Mobile | 0–639px | Single column, stacked |
| Tablet | 640–1023px | 2 columns, adjusted padding |
| Desktop | 1024–1439px | Full layout, 3 columns |
| Wide | 1440px+ | Max-width container, 1440px content, expanded whitespace |

---

## 23. Component Spacing Reference

| Component | Internal Padding | Bottom Margin (in flow) |
|---|---|---|
| Button | 24px horizontal | — |
| Input | 16px horizontal | 24px (if in form) |
| Card | 24px all | 24px |
| Portfolio Card | 0px (image), 16px top text | 40px |
| Project Card | 24px all | 40px |
| Testimonial | 0px (text only) | 48px |
| Accordion item | 16px 0px (label) | 0px (border separation) |
| Pricing Card | 32px all | 24px |
| Badge | 8px horizontal | 8px |
| Tag | 12px horizontal | 8px |
| Form section | — | 32px |
| Footer section | 80px top, 48px bottom | — |
| Navigation | 0px | — |

---

*This design system is a specification, not a constraint. Every component has a rationale. If a component does not serve the content, remove the component — not the rationale. When in doubt, use less.*
