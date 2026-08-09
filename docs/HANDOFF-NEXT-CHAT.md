# Portfolio Handoff

Last updated: 2026-08-10. Replaces an earlier handoff that pointed at a folder
and filename which no longer exist.

---

## 1. Where everything is

| | |
|---|---|
| Project folder | `C:\Users\brade\Desktop\ClaudeCodemy-app\My-Portfolio_Main` |
| Entry point | `index.html` (the whole portfolio shell: markup, CSS and JS in one file) |
| Git repo | This folder has its **own** `.git`. It is not part of the parent `ClaudeCodemy-app` repo. |
| Remote | `https://github.com/ShadowMonarch-collab/my-portfolio-main` (public) |
| Branch | `main`, tracking `origin/main` |
| Live site | `https://yourkickassghl.site` (also `www.`) |
| Host | Vercel, auto-deploys on push to `main` |
| Deploy latency | Usually under a minute |

**Important:** the parent folder `ClaudeCodemy-app` contains unrelated sibling
folders (`Applications/`, `Funnels/`, `Websites/`, `Test Projects/`,
`Portfolio Concepts/`, `Additional Portfolio Projects/`). Those are **not** part
of this project and must never be committed here. They were never tracked.

### Deploying

Ordinary git from inside `My-Portfolio_Main`:

```bash
git add -A
git commit -m "..."
git push
```

That is all. No build step, no `npm run`, no bundler. It is a static site.

To confirm a change is actually live before testing it, poll for a string you
just added rather than assuming:

```bash
curl -s "https://www.yourkickassghl.site/?cb=$(date +%s)" | grep -q "some new string"
```

Vercel's edge cache occasionally serves a stale copy for a few seconds after a
deploy. A `?cb=` cache-buster distinguishes "not deployed" from "cached".

---

## 2. What the project is

A single-page portfolio shell that switches between views client-side using
`?view=` query parameters, plus 22 self-contained demo projects served as real
static sites underneath it.

93 HTML pages total (excluding `node_modules`).

### Views (8)

`home` · `about` · `certificates` · `funnels` · `websites` · `mockups` ·
`automations` · `apps`

Routing lives in `index.html`. To add a view you must touch **four** places:

1. `appValidViews` (a `Set`)
2. `appViewTitles` (document titles)
3. `appViewOrder` (array)
4. The nav markup, plus a `<section data-view-groups="yourview">`

Then add it to `sitemap.xml`.

Sections are shown/hidden by matching `data-view-groups` against the active
view. One section can belong to several views (the portfolio grid does).

### Sub-projects

**Funnels (10)** — single-page conversion funnels:
Backline Events, Ellison Family Dental, GrindHouse, Kessler Auto,
ModernHomeEssentials v2, PeakForm, Tolliver Roofing, DailyResetMethod,
Havenwell Dental, NorthPeak Heating & Air

Seven live under `projects/funnels/Additional Portfolio Projects/`. That folder
name is confusing but is the **real, linked location** — the portfolio links
directly into it. It is not dead weight.

**Websites (10)** — multi-page sites, same brands:
Backline Events, DailyResetMethod, Ellison Family Dental, GrindHouse,
Havenwell Dental, Kessler Auto, ModernHomeEssentials (Arctic Home), NorthPeak,
PeakForm, Tolliver Roofing

**Apps (4)** — `projects/applications/`:
KensMotoCare (Vite/React, has `node_modules`, gitignored), color-studio,
daily-dose-of-knowledge, daily-grace

Every brand is **invented**. Phone numbers use the reserved `555-01XX` fictional
range deliberately. Do not "correct" them to look real.

---

## 3. Hard-won gotchas

These cost real time to find. Read before debugging.

### The in-app browser pane freezes CSS transitions

The Browser pane runs with `document.visibilityState === "hidden"`, so **CSS
transitions and animations never progress**. Every element sits at its initial
value. This produced three separate false conclusions in one session:

- All 16 scroll-reveal elements read as `opacity: 0` → looked like reveals were broken
- A `font-stretch` hover transition read as unchanged → looked like the font's width axis was broken
- Images with `loading="lazy"` never loaded → looked like broken images

**Geometry (`getBoundingClientRect`) is reliable in the pane. Anything involving
a transition, animation or lazy-load is not.** For those, drive headless Edge
via puppeteer instead (see §5).

### Measure the thing, not a proxy

Repeated own-goal: measuring a proxy and misreading it.

- Counted distinct `top` values to detect nav wrapping → a 2px alignment
  difference between two nav groups read as "two rows". Nothing was wrapping.
- Measured a close button's resting position and called it "fixed" → it was
  actually *jumping* 60px a moment after opening. Sampling only the end state
  missed a bug that happens during the transition.
- Double-encoded already-encoded URLs (`%20` → `%2520`) → reported 10 broken
  assets that were all fine.

If a check reports a problem, confirm the mechanism before fixing it. Sample
*during* transitions, not only after.

### CSS containing block vs `position: fixed`

A `position: fixed` element is positioned relative to the **viewport only if no
ancestor has a transform**. Any transformed ancestor becomes its containing
block instead.

This bit the system blueprint modal: `.system-close` sat inside
`.system-modal-shell`, which runs a scale-in animation. During the animation the
button was positioned against the panel; after it, against the viewport — a
visible 60px jump, and it scrolled off-screen on long pages.

Also note `animation-fill-mode: both` keeps an animation *attached* after it
finishes, and an attached transform animation creates a containing block even
when the final keyframe resolves to identity.

**Fix pattern:** move the fixed element outside the animated ancestor. Do not
try to detach the animation afterwards.

### Media queries do not add specificity

`.matrix tbody td { width: 39% }` (0,1,2) beats
`@media ... { .matrix td { width: auto } }` (0,1,1). The mobile override
silently lost, so a responsive table kept desktop column widths and squeezed
text to a 67px column.

When writing a mobile override, match or exceed the desktop rule's specificity.

### The mobile menu's hardcoded offset

The mobile menu is two stacked `position: fixed` panels. Because a fixed panel
cannot flow after another, the second panel's `top` is **hardcoded** to the
first panel's height, at two breakpoints (`≤900px` and `≤600px`).

Adding a third primary nav link made the first panel two rows tall and the
second panel was drawn straight over it, hiding a link entirely.

**If you add or remove a primary nav link, or change link heights, re-measure
those offsets.** They are commented in the CSS.

### Browser default margins

`<figure>`, `<blockquote>`, `<dd>` carry a UA default `margin: 1em 40px`. If a
stylesheet never resets it, such an element inside a grid cell sits low and
narrow. Found on Arctic Home: hero media, product media and photo review cards
were all 17px low and 40px narrow. Fingerprint is a `40px` horizontal margin.

### Windows / tooling

- `sharp` fails with `EUNKNOWN` if given a file path it must also write back to.
  Read into a buffer first: `sharp(fs.readFileSync(file))`.
- `path.join()` returns backslashes; comparing against a forward-slash root with
  `.startsWith()` silently fails. Use `path.resolve()`.
- Never use case-insensitive or regex find-and-replace on this repo. A
  case-insensitive replace once corrupted asset filenames and a town name.
  Literal, case-sensitive replacement only.
- `daily-grace` registers a service worker that stalls the `load` event. Use
  `waitUntil: 'domcontentloaded'` for that app.

---

## 4. Deployment config

`vercel.json` is the live config (`netlify.toml` exists as a mirror but Vercel
is what serves the site).

| Setting | Value | Why |
|---|---|---|
| `cleanUrls` | **false** | All 1007 internal links use explicit `.html`. With it on, `services.html` redirected to `services/`, pushing every relative asset path one level too deep and 404ing them. |
| `trailingSlash` | true | Makes bare directory URLs resolve correctly |
| CSP | see file | Tested live; 0 violations across 9 routes |
| Cache | assets immutable, HTML `must-revalidate` | Filenames are not fingerprinted |

CSP notably allows `https://www.openstreetmap.org` in `frame-src` for the map on
Ellison's contact page, and `formspree.io` in `connect-src` / `form-action`.

`object-src 'none'` blocks `<embed>`/`<object>`, so PDFs must be linked, not
embedded.

SEO files: `robots.txt` (disallows `/projects/`), `sitemap.xml` (8 view URLs),
`404.html` (custom; its assets must use **root-relative** paths since it is
served at arbitrary depths).

---

## 5. Verification tooling

Scratchpad scripts exist for repeat checks. They drive headless Edge via
`puppeteer-core` against the **live site**, so transitions actually run.

Location: the session scratchpad under
`C:\Users\brade\AppData\Local\Temp\claude\...\scratchpad\`
(these are session-scoped and may not survive; the patterns matter more than the
files).

Useful ones:

- `runtime-audit.js` — all 88 project pages × mobile + desktop; JS errors,
  failed requests, horizontal overflow, thin content
- `link-audit.js` — static: dead in-page anchors, missing link targets, dead
  cross-page fragments across 90 pages
- `csp-live.js` — CSP violations against real deployed headers
- `ua-margin-audit.js` — unreset browser-default margins
- `align-audit.js` — side-by-side grid/flex items whose tops do not line up
  (must skip containers with `align-items: center`, or it is pure noise)

Known acceptable false positives:

- `link-audit.js` reports 2 missing `manifest.webmanifest` in KensMotoCare's
  Vite source entries. The manifest lives in `public/` and is copied at build
  time; neither page is linked from the portfolio.
- Secret-scanning regexes hit `js-tokens` (npm package), "design tokens" in CSS
  comments, `password` in a library's input-type list, and the word "secret"
  inside idiom definitions in daily-dose-of-knowledge. All benign.

Clean up leftover headless processes afterwards — they hold file locks and once
blocked a folder rename:

```powershell
Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" |
  Where-Object { $_.CommandLine -like '*pptr-*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

---

## 6. Current state

Fully audited and live as of 2026-08-10. Verified:

- Security headers present on root and project pages
- CSP: 0 violations across 9 routes
- No secrets, no `.env` or key files tracked
- 26/26 external `target="_blank"` links carry `rel="noopener"`
- Third-party SVGs (GitHub, Netlify, Render, Supabase from Simple Icons) are
  inert: one `<path>` + `<title>`, no scripts
- 88 project pages clean at 390px and 1440px
- All 8 views clean, mobile and desktop
- Touch targets ≥44px down to 320px
- Safari confirmed working by the user

### Content integrity rules

Two things matter more than they look:

1. **The certificate is labelled exactly as the document reads** — "Live Funnel
   Building Masterclass, Technical Virtual Assistants, April 2026". It is **not**
   a GoHighLevel certification; the *instructor* holds that credential. Anyone
   who clicks sees the certificate, so the label must survive that comparison.
2. **Invented brands must stay internally consistent.** A real bug shipped where
   Kessler claimed "31 years" while its footer said "family owned since 1994" on
   a page dated 2026. Cross-check any number against every other mention.

### Open items

- `project-category.html` — orphaned, nothing links to it, `noindex`ed. Probably
  wants deleting.
- Project contact forms do not submit anywhere. Fine for spec work; would need a
  Formspree endpoint each to collect real enquiries.
- Resume is a Google Drive link (chosen so it can be updated without a redeploy).
  Worth periodically confirming sharing is still "anyone with the link".
- Tablet (768px) tech grid is 2 columns and fairly sparse; 3 would fit.

---

## 7. Working style

- Match verification effort to the size of the change. A one-line CSS tweak gets
  one targeted measurement, not a suite of browser scripts. Reserve full sweeps
  for structural or security-relevant changes, or an explicit audit request.
- If reading the code settles a question, say so rather than scripting a browser
  test to re-prove it.
- Front-end work on this portfolio should apply the anti-slop skills
  (`impeccable`, `taste-skill`, `ui-ux-pro-max`).
- Each of the 22 sub-projects has a deliberate, distinct brand identity. Do not
  apply a uniform treatment across them — the whole point is that they look like
  different businesses built by the same person.
