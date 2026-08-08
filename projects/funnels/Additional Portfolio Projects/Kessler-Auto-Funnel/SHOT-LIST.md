# Kessler Auto Works — funnel shot list & build notes

Single-page conversion funnel. A website version (multi-page) comes later and
should reuse this palette, type system and the inspection-report visual language.

---

## The invented business

| | |
|---|---|
| **Name** | Kessler Auto Works |
| **Location** | 1180 Godfrey Ave SW, Grand Rapids, MI 49503 |
| **Phone** | (616) 555-0173 |
| **Founded** | 1994 by Dale Kessler; run since 2019 by his daughter Nina Kessler |
| **Positioning** | "We show you the car." Every finding photographed and sent to your phone with a price before anything is touched. |
| **Offer** | The $29 Vehicle Health Scan — 47 points, photo/video report in ~90 minutes, itemised quote, $29 credited back against any approved repair |
| **Core fear addressed** | Not "my car is broken" but "I can't tell whether the person telling me it's broken is lying." |

---

## Design direction

**Category-reflex check.** The first-order reflex for auto repair is red / chrome /
checkered flag / bold italic condensed. Rejected. The second-order reflex — "auto
repair that *isn't* red-and-chrome" — lands on dark industrial with a hi-vis lime
accent. Also rejected. This build goes a third way.

**Colour — Committed strategy.** Signal green carries the brand. It is the colour of
the PASS lamp on a diagnostic and of the relief of being told your car is fine and
believing it, and it is the un-obvious pick in a category whose defaults are red and
blue. The canvas is cool shop concrete (chroma near zero, faintly cold) — deliberately
not the cream/sand/parchment band. Amber and red appear only as functional inspection
statuses, never as decoration.

| Token | Hex | Role |
|---|---|---|
| `--graphite` | `#14181A` | drenched sections, hero, footer |
| `--concrete` | `#E6E8E6` | page canvas |
| `--concrete-deep` | `#D6DAD8` | alternating section fill |
| `--bone` | `#F4F6F4` | report surface, cards |
| `--signal` | `#0B7A3E` | CTAs, brand |
| `--signal-deep` | `#08652F` | small text on light (5.8:1) |
| `--signal-lume` | `#3FCB7E` | brand on graphite only |
| `--pass / --watch / --fail` | `#0B7A3E` / `#8F5C05` / `#B3341F` | inspection statuses |

Lowest measured body-text contrast on the page is **6.2:1** — every pair clears AA
comfortably.

**Type — Chivo + Chivo Mono** (Omnibus-Type). One superfamily, chosen deliberately
rather than paired by reflex; Chivo was drawn for signage and reads plain and
unglamorous, which is the brand voice ("machined, plain-spoken, well-lit"). Mono
appears *only* where content is genuinely tabular — measurements, part numbers,
work-order metadata, prices — never as technical costume.

**Deliberate devices, used sparingly:** the mono "work-order stamp" appears in exactly
two places (hero, report header), not as a per-section eyebrow. Numbered markers appear
once, on the genuine three-step sequence.

---

## Imagery

All photography is real, free-licence Unsplash, downloaded locally and visually
verified before use. **Note:** every `plus.unsplash.com` premium result is watermarked
with tiled "Unsplash+" text and is unusable — only free `images.unsplash.com` photos
were used. Several otherwise-good candidates were also rejected for prominent third-party
branding (Brembo, Audi, Mobil 1, Rolls-Royce, Mercedes) or for reading as a cluttered
backstreet garage, which contradicts the trust positioning.

| File | Use | Notes |
|---|---|---|
| `hero-shop-floor.jpg` | Hero background, 30% over graphite | Real American multi-bay shop, trucks on two-post lifts |
| `tech-inspecting.jpg` | Hero side media | Technician under a work light — "the moment of finding it"; carries the floating report annotation |
| `owner-nina.jpg` | Founder portrait | Unposed, grease still on her hands; reads real, not stock-slick |
| `bay-empty.jpg` | Close-section background, 22% | Moody empty shop, fluorescent + concrete |
| `shop-bench.jpg` | Spare / website version | Workbench atmosphere |
| `part-brake.jpg` | Report row — rear rotors | |
| `part-tire.jpg` | Report row — tires | |
| `part-electrical.jpg` | Report row — serpentine belt | |
| `part-wheel.jpg` | Report row — sway bar links | |

Logos are hand-built SVG: a bolt-head hexagon with an approval check inside.
`logo-kessler.svg` (light bg), `-reversed.svg` (dark bg), `-mark.svg` (favicon).

---

## Interactive pieces

1. **Sample inspection report** — the centrepiece. Seven real rows with status chips,
   measurements, and photos. Rows expand; approve/decline checkboxes drive a live
   running total ($598 default → $784 all → $0 none).
2. **Symptom selector** — six common complaints. Each returns what it usually turns out
   to be, the real price range, and the actual diagnostic path. Selecting one pre-fills
   the booking form.
3. **Published price list** — four keyboard-navigable tabs (arrows, Home, End).
4. **FAQ accordion** — one open at a time.
5. **Booking form** — real per-field validation, phone reformatting, inline success state.
6. **Sticky mobile dock** — appears past the hero, hides over the booking form so it
   never covers its own target.

---

## Robustness notes (learned the hard way during this build)

Three real bugs were found and fixed by testing in-browser rather than assuming:

- **Lazy images inside collapsed containers never load.** `loading="lazy"` images parsed
  inside a `max-height: 0; overflow: hidden` container never enter the viewport, so the
  fetch is never scheduled — *and expanding the row does not re-trigger it*. The report
  section would have shipped with no photographs at all, which is the one thing this
  brand cannot afford. Fixed by promoting them to `eager` on first open.
- **Accordions must not depend on JS to be readable.** The collapsed state now lives
  under `.js`, so with scripting off every finding and FAQ answer ships open.
- **A stalled animation clock leaves reveal sections blank.** In a background tab or a
  headless renderer, transitions pin at `currentTime: 0` and content sits at opacity 0
  forever — adding the `.in` class cannot rescue it. The failsafe therefore drops the
  `motion` class *and* cancels in-flight transitions (suppressing the declaration first,
  or cancelling merely starts a fresh stalled transition). `requestAnimationFrame` is
  likewise never trusted alone for state that must land — a timer backs it up.

Reveals are opt-in on top of an already-visible default, and `prefers-reduced-motion`
is honoured throughout.

---

## Placeholders to wire before this goes live

- `js/main.js` — booking form POST target (name, phone, vehicle, symptom) to the shop's
  scheduling system or CRM webhook. Marked with `[PLACEHOLDER]`.
- Footer social links are `#`.
- The sample report is illustrative and labelled as such on the page.
- Testimonials, review counts and prices are invented for this portfolio piece.

## Preview

`.claude/launch.json` → `kessler-funnel` on port 8976.
