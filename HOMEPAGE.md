# GraphicCity — Homepage Design Specification

**Designed by:** Apple's Lead Product Designer
**Tone:** Apple Keynote reveal — quiet, cinematic, confident
**Structure:** 6-act narrative arc. The page itself is the argument.
**Constraint:** No portfolio grids. No carousels. No logo walls. Nothing familiar.

---

## Global Page Parameters

| Element | Spec |
|---|---|
| Canvas | 1440×900 base viewport. Full-viewport sections. Fluid beyond 1440. |
| Scroll | Snap-scroll with narrative lock. Each act is a full viewport "beat." Acceleration curve matches signature easing. |
| Navigation | Hidden. Small "Menu" text link (12px Medium, letter-spaced +0.06em) in top-right. Click → full-screen overlay. No header bar. No logo in header. |
| Cursor | Custom cursor on hero sections — a subtle ring that trails the pointer. Standard cursor on content-dense sections. |
| Performance | All motion is GPU-accelerated transforms and opacity. No layout thrashing. |
| Reduced motion | Entire page works as a linear scroll with opacity fades. No parallax, no spring physics when reduced motion is preferred. |

---

## Act I: The Threshold

**Purpose:** Stop the visitor. Create intrigue. Make them lean in. No branding, no explanation — just presence.

**Headline:** *None.* A single word cycles in the center of the screen.

**Cycling words (in order, 4-second cadence):**
> Craft.
> Precision.
> Restraint.
> Timeless.

**Subheading:** *None.*

**Content:** No copy. No logo. No navigation. Just a single word in the center of a black void, slowly cycling. Each word dissolves into the next with a 1.5-second crossfade. The letters themselves are animated — each character arrives staggered by 60ms.

**CTA:** *None.* The only action is to scroll. A faint scroll affordance at the bottom — a thin horizontal line that pulses opacity on a 3-second loop.

**Layout:** Absolute center. Single word sits at the exact optical middle of the viewport. Nothing competes.

**Animation:**
- Page load: 2-second hold on black. Then first word (Craft) fades in over 800ms, letters staggered 60ms apart.
- Hold for 3.2 seconds. Then dissolve into Precision over 1.5 seconds.
- Pattern repeats through the cycle. No loop indicator — the cycle could be infinite or it could end. The visitor decides by scrolling.
- Scroll-away: The current word scales up to 1.15x and fades to white, then the next act takes over.

**Interaction:** Scroll anywhere → advances to Act II. The scroll locks so that a single discrete scroll event (mouse wheel, trackpad flick, arrow key, or touch swipe) moves cleanly to the next act. No half-state.

**Spacing:** The word sits at vertical center. No other elements on screen. The scroll affordance is 48px from the bottom edge, centered, 40px wide, 1px tall, opacity 0.3.

**Background:** Pure Core Black (`#0A0A0A`). No gradient. No texture. Absolute void.

**Typography:**
- Face: ABC Social (or primary editorial grotesk)
- Weight: Light (300)
- Size: 128px on desktop (fluid down to 64px on mobile)
- Tracking: -0.03em
- Color: Core White (`#FFFFFF`) at 0.85 opacity. Not pure white — slightly softened for the dark.

**Image placement:** None. Pure typographic experience.

**Surprise:** No logo. No "hero image." No value prop. No tagline. A design studio's homepage starts with a single word in the dark. The visitor must choose to engage.

---

## Act II: The Statement

**Purpose:** Now that they chose to scroll, deliver the mission. One declarative sentence. The entire thesis of the studio.

**Headline:**
> Design, made permanent.

**Subheading:** *None.* The headline is sufficient.

**Content:**
A single paragraph of manifesto. Set in a narrow column. The text is short enough to read in one breath:

> We believe design is not a commodity. It is not a coat of paint. It is the structure of thought itself. Every pixel, every curve, every micro-moment is an opportunity to communicate something that lasts. We make things that earn their place in the world — not for a quarter, but for a decade.

**CTA:** *None.* Not yet.

**Layout:**
- Split canvas: 50/50.
- Left half: The manifesto text, vertically centered, right-aligned within its half, max-width 420px.
- Right half: A full-height ambient visual. No text overlay.

**Animation (scroll-driven):**
- As the visitor enters Act II (scroll forward from Act I), the manifesto text is already visible — it faded in during the transition. But the *emphasis* lands on scroll.
- Each sentence of the manifesto subtly brightens as it becomes the focal point.
- A thin vertical line (1px, Stone 700) traces downward along the left edge of the text block, pacing the reading. The line is synced to scroll position.
- The right-half visual is a slow-motion film loop playing at 8fps (intentionally juddery — like 1970s slow-motion celluloid).

**Interaction:** Scroll reveals the visual over time. The film loop on the right advances frame-by-frame with scroll position. Pause scrolling → the frame freezes. Rescroll → it continues. The left side text is fully readable; only the emphasis shifts.

**Spacing:**
- Left text block: 120px from left edge of its half, 420px wide.
- Right visual: full-height of viewport.
- Gap between halves: 64px minimum.
- Vertical centering throughout.

**Background:** Still Core Black (`#0A0A0A`), but with an almost imperceptible gradient — a very subtle lift from the right side, as if the visual is casting a warm glow.

**Typography:**
- Headline ("Design, made permanent."): ABC Social Light, 56px, -0.02em tracking, Core White at 0.9 opacity.
- Body: Inter Regular, 16px, 28px line-height, Stone 400 (`#A3A3A3`). The contrast between the bright headline and the softer body creates the hierarchy.

**Image placement:**
The right half contains a 16:9 letterboxed video loop within the vertical frame. Content: extreme close-up of a physical material being shaped by hand. Clay on a wheel. Ink spreading on damp paper. A single letterform being carved. The material should feel tactile — something you want to reach out and touch. The juddery 8fps treatment gives it a dreamlike, artifact quality. No brand logos, no screens, no digital mockups. This is the physical world.

**Surprise:** The left/right split is inverted from convention. Text is right-aligned within its half, pushing toward the center, as if the word is leaning into the image. The scroll-synced film frame gives the right side an interactive, almost investigative feel — you are "scrubbing" through the material.

---

## Act III: The Evidence

**Purpose:** Prove the thesis with work. But not a portfolio. A single project told as an immersive scroll-film. Depth over breadth.

**Headline:** The project title.

**Subheading:** Client name + discipline.

**Lettered sections within the act (A–E):**

---

### III-A — Title Card

**Content:** Project title in large type. Client name beneath it. Discipline tag in caption style. That's all.

**Layout:** Centered. Full viewport. Minimal.

**Animation:** Title fades in. Then client name. Then tag. Each 300ms apart.

**Background:** Pure white (`#FFFFFF`).

**Typography:** Title: 72px Light. Client: 20px Regular. Tag: 12px Medium, +0.06em tracking, uppercase.

---

### III-B — The Problem

**Content:** 2 sentences describing the challenge. Not feature benefits — the human tension.

> "A brand built for a different era. A product outpacing its identity. They needed not a refresh, but a re-foundation."

**Layout:** Text block, left-aligned, 520px max-width, positioned at the lower third of the viewport. The upper two-thirds is negative space.

**Animation:** Text fades in at the bottom as you scroll. The upper void is intentional — it creates a feeling of "before."

**Background:** White.

**Typography:** Body in Inter Regular 16px, Stone 700 (`#404040`). Leading 28px.

---

### III-C — The Approach (Scroll-Film Sequence)

**Content:** 6 visual frames that tell the thinking. Each is a full-viewport image or video. Between each frame, a single line of text appears as an interstitial.

**Frame sequence (scroll advances through each):**

| Frame | Visual | Interstitial text |
|---|---|---|
| 1 | Research artifacts pinned to a physical board. Photographed, not screenshot. | "We started by listening." |
| 2 | Hand-drawn thumbnail sketches. Dozens of them, tiled. | "Then we explored." |
| 3 | A single refined direction. One hero mark on a blank page. | "We found the signal." |
| 4 | The final identity — lockup on a pure background. Clean. Resolute. | "Distilled to its essence." |
| 5 | The identity applied: signage, packaging, digital. Real-world photography, not mockups. | "Brought into the world." |

**Layout:** Full-bleed frames with text overlay. The interstitial text is centered at the bottom 20% of the frame.

**Animation:** Each frame is a full viewport. Scrolling transitions between frames with a 600ms crossfade. The interstitial text fades in 200ms after the frame is fully visible, then fades out 200ms before the next frame.

**Interaction:** Scroll snap is engaged — each frame is a scroll "stop." The visitor controls pacing. Fast scroll = rapid frame advance. Slow scroll = dwell.

**Background:** Alternates between black and white per frame, chosen to contrast the visual content.

**Typography:** Interstitial text: ABC Social Light, 32px, white on dark frames, black on light frames.

**Image placement:** Full-bleed. Each frame is a single image or video that fills the entire viewport. Text overlays are positioned to avoid competing with the subject.

---

### III-D — The Result (Single Data Point)

**Content:** One metric. One sentence of context. Nothing more.

> **33%**
> Increase in brand recall within 6 months of launch.

**Layout:** Centered. The number is massive — 200px. The context is small — 14px beneath it. The contrast between the giant number and the quiet context makes the result feel both impressive and understated.

**Animation:** The number "counts up" on scroll — but from the final value *downward*, as if it's settling into place. A subtle reverse-count animation. 33 pulses in, each representing 1%.

**Background:** Core Black.

**Typography:** Number: 200px, Light weight, white, -0.03em tracking. Context: Inter Regular, 14px, Stone 400.

---

### III-E — Transition to CTA

**Content:** A single line of text:
> "This is one story."

**Subtext beneath it:**
> "We have more."

**Layout:** Centered. Small. Quiet. Acts as a breather between the depth of the case study and the next act.

**Animation:** Fades in slowly over 1 second. Holds for 2 seconds. Then fades out as Act IV begins.

**Background:** Core Black → transition to the next act's background.

**Typography:** ABC Social Light, 28px, white.

---

## Act IV: The Method

**Purpose:** Show how we think. Not a diagram — a felt experience of the process.

**Headline:** *None.* The process itself is the content.

**Content:** 4 phases. Each is a full-viewport "chapter" with its own visual language.

| Phase | Name | Visual Language | Background |
|---|---|---|---|
| 01 | Discover | Scattered artifacts floating in negative space. Research documents, clippings, photographs drifting slowly. | Deep indigo (`#0F172A`) |
| 02 | Define | A single board assembling itself — mood, palette, reference points coalescing. | Warm charcoal (`#1C1917`) |
| 03 | Design | Iterations spawning, splitting, refining. A family tree of ideas branching and being pruned. | Pure white (`#FFFFFF`) |
| 04 | Deploy | The final output applied across environments. Still photographs of real-world use. | Core Black (`#0A0A0A`) |

**Layout:** Each phase is a full viewport. The phase number (01–04) is set in massive type (200px) in the top-left corner. The phase name is set smaller beside it (28px). A one-line description sits at the bottom of the viewport. The center is reserved for the visual element.

**Animation:**
- Phase transition: The background color shifts over 800ms with the signature easing.
- Visual element: Unique per phase.
  - Phase 01: Elements drift in Brownian motion. A user could scroll back and forth and the elements would continue drifting along their path — no reset.
  - Phase 02: The board assembles as you scroll forward. Elements slide into place from off-screen. Scroll backward and they retreat. The board is never "done" until you reach the threshold of Phase 03.
  - Phase 03: Iterations branch outward from a center point, like a tree growing in time-lapse. Each branch is a design direction. Most fade to gray (pruned). One remains highlighted red (the chosen direction).
  - Phase 04: A slow horizontal pan across a still photograph of the brand in the world. The scroll position maps to the pan.

**Interaction:** Forward scroll advances to the next phase. The visual elements respond to scroll position — they are not on a timer. A small progress indicator (04/04 style) lives in the bottom-right corner.

**Spacing:** Each phase fills the full viewport. Text is positioned at the edges (phase number top-left, description bottom-right). The center is open for the visual.

**Typography:**
- Phase number: ABC Social Light, 200px, 0.3 opacity on dark backgrounds, 0.1 opacity on light.
- Phase name: ABC Social Regular, 28px, full opacity.
- Description: Inter Regular, 14px, Stone 400 or equivalent contrast.

**Image placement:** The center of each phase is an interactive visual — part illustration, part data visualization, part animation. Not a photograph. Not a render. A custom-built, code-driven visual that responds to scroll position.

**Surprise:** The process is not a graphic. It is a *behavior*. You don't read it — you *feel* it. Each phase has a different texture, a different pace, a different color world. The shift between phases is a color narrative: indigo → charcoal → white → black. A cycle from darkness through warmth to purity and back to black.

---

## Act V: The Trust

**Purpose:** Show who trusts us without showing a single logo.

**Headline:** *None.*

**Content:** A vertical list of client names. Nothing else. No titles. No descriptions. No logos. Just names. Set in large, beautiful type. The names themselves are the visual.

```
Stripe
Linear
Notion
Figma
Patagonia
Aesop
```

**Layout:** Single column. Centered within a 600px max-width. Each name is spaced generously — 48px between baselines. The list feels like a colophon or a film end-credit roll. It scrolls naturally as part of the page (not snap-scrolled).

**Animation:** Each name fades in as it enters the viewport during scroll. The entrance is staggered — each name appears 200ms after the previous.

**Interaction:** Hovering over a name changes its weight from Regular to Medium (a 100-weight shift) and shifts its color from Stone 500 to Core Black. No underline, no background, no button treatment. Just a subtle acknowledgment.

Clicking a name navigates to the associated case study on the Work page.

**Spacing:** The section itself has 160px top padding and 160px bottom padding. Each name has approximately 48px between baselines. The list is short — 6–7 names. Enough to signal trust. Too many would feel like a directory.

**Background:** Off-white (`#F5F5F5`). A warm shift from the previous black sections. It feels like a breath.

**Typography:**
- Names: ABC Social Regular, 40px, Stone 500 (`#737373`). The subdued color is intentional — the names don't need to shout.
- On hover: ABC Social Medium, 40px, Core Black (`#0A0A0A`).

**Image placement:** None. Pure typography.

**Surprise:** No logos. No tiers. No "Trusted by" header. Just names set in type that is *too large* for a generic list, creating a deliberate dissonance. The visitor has to slow down and read each one. The absence of logos is itself a statement: we don't need your marks to signal our value. The names alone carry weight.

---

## Act VI: The Invitation

**Purpose:** Convert. The close of the narrative. One action.

**Headline:**
> Let's make something lasting.

**Subheading:**
> Every project begins with a conversation. Tell us what you're building.

**Content:**
A single sentence beneath the headline:
> We work best with people who care about the details. If that sounds like you, we'd love to hear from you.

**CTA:**
- **Primary:** A large, text-based CTA: "Start a Project" — not a button shape, but a typographic element that happens to be clickable. It sits alone in the center. Underlined with a 1px line on hover. The underline extends from left to right on hover over 300ms.
- **Secondary:** Beneath, in smaller type: "or view our capabilities" — a text link to the Capabilities page.

**Layout:** Center-aligned. Full viewport. The headline, CTA, and secondary link are vertically centered. No other elements. The section is deliberately *empty*.

**Animation:**
- On entering the section (scroll from Act V), the headline fades in over 600ms.
- The CTA appears 200ms later.
- The secondary link appears 400ms later.
- On hover of the CTA, a 1px underline animates from left to right over 300ms. The text color shifts from Stone 400 to Core White.

**Interaction:** Click → navigates to /start. The secondary link → navigates to /capabilities.

**Spacing:**
- Vertical: Full viewport. Headline + CTA block is vertically centered.
- Headline to CTA: 48px.
- CTA to secondary link: 24px.

**Background:** Core Black (`#0A0A0A`). We opened in black and we close in black. The full-circle creates structural poetry.

**Typography:**
- Headline: ABC Social Light, 56px, -0.02em tracking, Core White at 0.9 opacity.
- CTA: ABC Social Regular, 24px, Stone 400. On hover: Core White.
- Secondary link: Inter Regular, 14px, Stone 500.

**Image placement:** None.

**Surprise:** No footer. No social links. No sitemap. The page ends here. The only exit is the CTA. If the visitor wants to browse elsewhere, they open the menu (top-right text link). The homepage is a closed narrative loop — you enter, you experience, you either convert or leave. There is no "browse more" at the bottom.

---

## Menu (Full-Screen Overlay)

**Trigger:** "Menu" text link in top-right corner. 12px, Medium, +0.06em tracking, uppercase. Always visible. Always the same position.

**Overlay content:**
- Vertical navigation list, centered.
- Items set in large type (48px, ABC Social Regular):
  - Work
  - Capabilities
  - About
  - Journal
- Below the nav: a horizontal row of social links (12px, Medium, uppercase, +0.06em tracking):
  - LinkedIn / Instagram / Twitter / Dribbble
- Bottom-left: email address (14px, Inter Regular, Stone 400).
- Bottom-right: "Start a Project" — the same CTA as the page, rendered as a text link with the same underline-on-hover treatment.

**Animation:**
- Open: Background fades in over 400ms (opacity 0 → 0.98). Nav items slide up from below, staggered 80ms apart.
- Close: Reverse. Items fade out, then background fades. Total close time: 300ms.
- Background: Core Black with 0.98 opacity. Slightly transparent to hint at the page beneath.

**Interaction:** Click any nav item → closes menu + navigates. Click outside the nav area → closes menu. Escape key → closes menu.

---

## Footer (Minimal — Menu Only)

The footer does not exist on the homepage as a persistent element. It is only accessible via the menu overlay. In the menu's bottom area:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                     Work   Capabilities                      │
│                     About   Journal                          │
│                                                              │
│      LinkedIn   Instagram   Twitter   Dribbble               │
│                                                              │
│      hello@graphiccity.studio          [Start a Project]     │
│      © 2026 GraphicCity                                       │
│      Privacy   Terms                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## Scroll Architecture Summary

| Act | Scroll Behavior | Snap? | Duration |
|---|---|---|---|
| I — Threshold | Single scroll → Act II | Snap | 0.5s transition |
| II — Statement | Narrative scroll (continuous) | No snap | ~3s of scroll |
| III — Evidence | Frame-by-frame snap | Snap | 6 snap points |
| IV — Method | Phase-by-phase snap | Snap | 4 snap points |
| V — Trust | Free scroll (content-driven) | No snap | Natural |
| VI — Invitation | Single scroll → bottom | Snap | 0.5s transition |

**Keyboard navigation:** Up/Down arrow keys, Page Up/Down, Space/Shift+Space all follow the snap behavior where snap is enabled. Home key → Act I. End key → Act VI.

**Mobile:** Snap behavior is preserved but the transitions are simplified to opacity crossfades (no parallax, no film-scrub). Touch swipe gestures replace scroll wheel. The word cycle in Act I is touch-activated: tap to advance, hold to dwell.

---

## Performance & Accessibility

- Every animation uses `will-change: transform, opacity` and avoids layout-triggering properties (no `top`, `left`, `width`, `height` animation).
- Reduced motion: A single `@media (prefers-reduced-motion: reduce)` rule collapses all scroll-based animations to opacity reveals. The page becomes a clean, linear scroll with no parallax, no frame-advance, no stagger.
- Focus management: Menu overlay traps focus. Case study frames manage focus per snap point.
- Color contrast: All text meets WCAG 2.1 AA. The brand keywords in Act I (white at 0.85 opacity on black) exceed the 4.5:1 ratio.
- No autoplay video. Act II's film loop is CSS-animated frame advances tied to scroll, not a `<video>` element. Act III's video frames are poster images with optional video enhancement for capable browsers.

---

*This homepage is not a layout. It is a narrative. Each act builds on the last. The visitor does not browse — they experience. And at the end, there is only one action to take.*
