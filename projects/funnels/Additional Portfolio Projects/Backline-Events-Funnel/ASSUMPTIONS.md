# ASSUMPTIONS & MISSING INFO — Backline Events Co.

There was no client brief for this build. The business is invented end to end as a portfolio
piece, so **everything on the page is sample data.** This file lists what was decided, what
was invented, and what a real client would have to supply or approve.

## Source of the build

| Input | Used |
|---|---|
| Design Direction | `Design Direction/packs/events/data.js` → `events-bold-confident`, "No Panic Events" |
| Execution rules | `Design Direction/CRAFT-ADDENDUM.md` |
| Structure/placeholder rules | BUILD RULES from `Design Direction/packs/_shared/app.js` |

Bold & Confident was picked because the other four funnels in this folder already cover
Energetic (PeakForm), Warm & Human (Rivertown), Luxury (GrindHouse) and Clean (ModernHome).
It also happens to be the direction that fits *coordination* rather than planning: its whole
angle is day-of command, which is exactly what an event coordinator sells.

## Invented, and needing client sign-off

- **Brand name, "Backline Events Co."** A backline is the gear and crew set up behind a
  performer. It reads as "the people behind you" and as "a second line of defence," which
  carries the contingency angle. Not trademark-checked.
- **Location: Portland, Oregon.** Chosen so the weather contingency row is credible. Address
  and phone are marked `[PLACEHOLDER]` and are not real.
- **The three roster roles** (Lead Coordinator, Vendor Lead, Floor Captain) and what each one
  owns. Plausible for a coordination outfit, but this is the real team structure question a
  client has to answer. Names are `[PLACEHOLDER]`.
- **The six contingency-matrix rows.** Written to be specific and physical rather than
  reassuring. The direction's own risk note applies and is repeated on the page: *these must
  reflect genuine, resourced capability before launch.* Do not publish a backup the team
  cannot actually deliver.
- **The three crisis stories and their pull quotes.** Written to the correct shape (a time
  stamp, what went wrong, what was done, what the client experienced) but they are
  illustrative. Flagged in-page as sample data, with `[PLACEHOLDER]` client attributions.
  Replace with real logged incidents and written permission.
- **All numbers** (140 guests, 96 guests, 180 covers, four minutes, 3:40) are sample.

## Deliberate deviations, and why

- **Headline runs to 3 lines at desktop, not the Craft Addendum's 2.** Archivo Black is a very
  wide face and the direction owns the headline's wording. Fitting it on two lines would have
  meant either cutting direction-owned copy or dropping the h1 to roughly 24px. The rule's
  actual purpose is met: the hero fits the first viewport and the CTA sits at 527px on a
  1280x720 screen, well above the fold. Verified at 375x667 too (CTA at 449px).
- **No portraits on the On-Site Command section**, though the direction specs an image per
  card. The available stock headshots were three unrelated visual worlds (a glamour shot, a
  street portrait, a corporate seated portrait) and would have looked worse side by side.
  More importantly, attaching invented names to real strangers' faces is the most
  fabrication-adjacent move on the page. The section is a typographic command roster instead,
  which also suits an ops-board brand better. Swap in real team portraits when they exist.
- **Roboto as the body face.** impeccable's detector flags it as an overused font. The
  direction names "Inter / Roboto" and wins on fonts by the project's own precedence rules;
  Roboto was picked over Inter as the less saturated of the two sanctioned options. Archivo
  Black, the direction's first-choice display face, is not on any reject list.
- **Signal Orange only ever carries large text.** #D04D39 is a mid-tone: nothing reaches
  4.5:1 against it, so CTA labels are set at 19.2px bold to clear the WCAG large-text
  threshold (white on orange measures 4.37:1 against a 3:1 requirement). Small orange-on-dark
  labels were rejected outright for this reason and are set in Panel instead. The palette
  hexes are unchanged.

## Verified before delivery

Checked in a real browser at 1280x720, 375x812 and 375x667:

- No console errors; all five images and both webfonts load.
- Contrast audited on all 20 text/background pairings. One failure found (footer fine print
  at 2.5:1) and fixed to 5.7:1. No remaining failures.
- Hero CTA above the fold at every size tested; no CTA label wraps.
- Every multi-column section collapses to one column; the contingency matrix restacks into
  labelled blocks. No horizontal overflow at any width.
- Form drives correctly: empty submit blocks and focuses the first bad field, per-field errors
  appear and clear, the success panel takes focus.
- One h1, ordered headings, alt text on every image, `scope` on every table header.
- **Reveal animations cannot ship a blank page.** IntersectionObserver never fires in a hidden
  document, which broke the first implementation (all 25 sections stuck at opacity 0 in the
  preview renderer). Now the gate is dropped outright for hidden documents, reduced-motion,
  missing IO support, or a failed script, with a 2.5s failsafe armed before first paint.

Not verified: pixel screenshots. Both browser screenshot tools were unavailable this session,
so layout was checked through measured DOM geometry rather than by eye. **Worth one human
look before this goes in the portfolio.**

## Still needed from a real client

Exact CTA wording, real pricing and what a coordination package includes, service area,
insurance and certifications, real vendor-partner names, Google/Yelp review assets, and the
photography in `SHOT-LIST.md`.
