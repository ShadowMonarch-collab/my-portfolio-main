# Tolliver Roofing & Exteriors — lead funnel

Single-page conversion funnel for an invented third-generation roofing contractor in
Des Moines, Iowa. Vanilla HTML, CSS and JS, no build step. Open `index.html`, or serve
the folder on any static server.

---

## The concept

The category's real emotion is not "I want a beautiful roof." It is **"I am about to be
ripped off and I have no way to check."** Iowa is hail country, and after every spring
storm the metro fills with out-of-state crews working door to door.

So the funnel sells the *opposite* of urgency. The offer is a free inspection whose
headline promise is that it might tell you to do nothing:

> **Do you actually need a new roof?**
> A free 45-minute inspection, photos of every problem area, and a straight answer.
> Even when the answer is no.

Every section reinforces that one position. The differentiators are all restraint
claims: we tell you when the roof is fine, we do not canvass after storms, the estimate
is the price, we follow up exactly once.

**Single conversion intent.** One CTA label, `Get My Roof Report`, used in the nav, the
hero and the close. Nothing else on the page competes with it.

---

## Design direction

Deliberately *not* the category reflex (navy and safety orange, hard hats, urgency red),
and not the second-order reflex either (warm craftsman beige, which the portfolio already
uses on Rivertown and GrindHouse).

**Colour strategy: Committed.** Slate, the colour of a weathered asphalt shingle, carries
the header, the hero panel, the storm section, the close and the footer — roughly 40% of
the surface. One accent throughout: **patina**, the green that copper flashing turns after
twenty winters. Materials that tell the truth as they age is the whole brand argument, so
the accent carries the idea rather than decorating it.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| Slate | `#1C2226` | dark grounds, headlines | 14.7:1 on paper |
| Slate mid | `#39434A` | dark fills | |
| Ink soft | `#55616A` | body copy on light | 5.8:1 on paper |
| Mist | `#E3E8E7` | light section fill | |
| Paper | `#F3F5F4` | page canvas (cool, chroma near zero) | |
| Patina | `#197C63` | CTA fill | 5.1:1 with white |
| Patina ink | `#146452` | patina text on light | 6.4:1 on paper |
| Patina lit | `#6ECBB0` | patina on slate | 8.3:1 on slate |

**Type: Archivo, one family.** Contrast comes from the variable **width axis** (expanded
display against normal body), not from a second typeface. Signage-adjacent, sturdy,
plain-spoken. No serif — this brand is not editorial or heritage-luxury.

**Shape:** a single 2px radius token, on buttons, inputs and images only. Nothing else is a box.

**Theme:** light, locked. The slate sections are the brand's structural ground, not a
mode flip.

---

## Section order and layout family

Nine sections, nine different layout families, so no two read the same.

| # | Section | Layout family |
|---|---|---|
| 1 | Hero | asymmetric split, slate panel + full-bleed photo |
| 2 | Credentials | four-up horizontal fact strip |
| 3 | The problem | drenched photo statement, two-fork list |
| 4 | The Roof Report | asymmetric split, spec list + sticky evidence photos |
| 5 | Process | four-step numbered sequence with rules |
| 6 | Proof | featured quote beside photo, then a divided pair |
| 7 | The promise | portrait + four written commitments |
| 8 | FAQ | accordion |
| 9 | Close | full-bleed photo + lead form |

Numerals appear once, in section 5, where the content genuinely is a sequence.
Two eyebrows total across nine sections.

---

## Motion

Restrained and motivated. Every animation does one job:

- **Hero settle** — slow push-in on the photo, draws the eye above the fold. Once, on load.
- **Scroll reveals** — paces a long scroll so each section reads as a single idea.
- **FAQ accordion** — state transition on a real disclosure, one answer open at a time.
- **Form states** — feedback on the only action the page asks for.

Nothing loops, nothing parallaxes, nothing hijacks the scroll. No scroll listeners
(IntersectionObserver only). `prefers-reduced-motion` collapses all of it.

**Reveal failsafe.** Content is only hidden once JS sets `.js` on the root, and it is
force-revealed on reduced motion, on missing IntersectionObserver, on load, and on any
`visibilitychange` to hidden. A paused, backgrounded or headless render can never ship a
blank section. With JS off entirely, nothing is hidden and every FAQ answer is open.

---

## Verified

Checked in-browser at 1440, 1280, 1024, 768 and 375:

- Zero console errors, zero broken images, zero horizontal overflow at every width
- Every text colour passes WCAG AA against its actual background (lowest measured 5.12:1,
  which is the white-on-patina CTA)
- Hero fits the fold with the CTA visible, h1 holds two lines at every width
- Nav stays on one line at 68px, no CTA label wraps
- All 24 reveals resolve on a hidden-tab render
- FAQ opens, closes siblings and toggles off; `aria-expanded` tracks
- Form validates per field with `aria-invalid` and focus management, then reaches its
  success state
- Skip link, landmarks, labelled inputs, resolving anchors, clean heading order
- No em-dashes or en-dashes anywhere

---

## Security notes

This page collects PII (name, mobile number, home address), so a few things matter more
here than on a brochure page.

Already handled in the code:

- **The form is `method="post"`.** Left to default it would be `GET`, and any JS failure
  would push the visitor's name, phone and street address into the URL, the browser
  history, the server access log and the outbound `Referer` header. Do not remove the
  attribute when you wire up the real endpoint.
- **The success message is built through the DOM, not `innerHTML`.** The visitor's name
  goes in via `textContent`, so markup typed into that field can never become markup on
  the page. Keep it that way if you edit the confirmation copy.

Still to do at deployment, outside this repo:

- **Serve over HTTPS only**, with HSTS. A lead form on plain HTTP puts the address and
  phone number on the wire in cleartext.
- **Add a Content-Security-Policy.** A tight starting point given what the page loads:
  `default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; script-src 'self'; form-action <your endpoint>; frame-ancestors 'none'; base-uri 'none'`.
  Also send `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Rate-limit and add anti-spam to the endpoint.** A public lead form with no backend
  protection gets scraped and stuffed. Prefer a server-side check (a timing trap or a
  privacy-respecting captcha) over anything that blocks real customers.
- **Consider self-hosting the Archivo font.** Google Fonts is loaded from
  `fonts.googleapis.com`, which discloses each visitor's IP to Google. German courts have
  found that this needs consent under GDPR. Self-hosting the woff2 files removes the
  third-party request entirely and drops two DNS lookups off the critical path.
- **Have a retention and consent story** for the leads before you collect them.

## Placeholders to replace before this goes live

- **Testimonials** (section 6) are illustrative sample copy. There is a visible
  `[PLACEHOLDER]` note in the markup. Swap in real quotes with permission.
- **Form handler** — `js/main.js` fakes the response. Look for the `[PLACEHOLDER]` comment
  and POST to the real CRM or scheduling webhook.
- **Company details** — name, phone, address, licence claim, review counts and the
  1,900-roofs figure are all invented for the concept.
- **Photography** is stock from Unsplash, standing in for real job-site and crew shots.
  The report evidence photos in section 4 should become frames from an actual Roof Report.

## Photography

Eight photos in `assets/`, each chosen for the specific moment rather than the category:

| File | Shot |
|---|---|
| `hero-roofer.jpg` | roofer in a harness nailing a course against open sky |
| `storm-sky.jpg` | storm front rolling over a roofline |
| `damage-missing-shingle.jpg` | missing shingle, exposed underlayment |
| `moss-shingles.jpg` | moss across old curling shingles |
| `tearoff-roofline.jpg` | tear-off in progress, decking open, ladder set |
| `house-finished.jpg` | finished charcoal roof on a gabled house |
| `owner-portrait.jpg` | owner beside a stepladder |
| `close-dusk-homes.jpg` | winter dusk, one house lit warm |

---

## Next

A multi-page **website version** of this brand, the same way GrindHouse, PeakForm,
Rivertown and ModernHome were expanded. The funnel is single-intent; the website carries
full service detail, the storm-damage and insurance content, a service-area map, and
builds legitimacy across pages.
