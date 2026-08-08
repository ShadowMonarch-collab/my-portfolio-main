# Portfolio Handoff - Next Chat

## Project

Project folder:

`C:\Users\brade\Desktop\CodexChatGPTmy-app\Portfolio-concept-0-Nexus`

Main file:

`C:\Users\brade\Desktop\CodexChatGPTmy-app\Portfolio-concept-0-Nexus\concept-0-Nexus.html`

This is the active portfolio project. It is currently a static portfolio, mostly contained in `concept-0-Nexus.html`, with local assets and embedded demo projects under:

- `assets`
- `projects`
- `docs`
- `archive`

There is no `package.json` and no build/lint/test script. Treat it as a static HTML/CSS/JS project unless that changes.

## Current Architecture

The portfolio is a single-page website with SPA-style view switching. It should feel like app tabs, but without full page reloads.

Current main views:

- Home
- Websites
- Funnels
- Design Mockups
- Automations
- Apps
- About / Contact

Navigation uses `?view=...` URLs and internal JavaScript view switching. Do not convert it back to anchor scrolling.

The active visual identity is the dark Nexus / GHL command-center style:

- Dark background
- Amber/orange accents
- Canvas node effects
- Scanner effects
- Premium tab transitions
- KEN robot assistant
- Project preview modals
- Automation blueprint modal

Preserve the design, layout, effects, animations, content, assets, and user experience unless the user explicitly asks to change them.

## Important Current Assets

- Logo: `assets\v2_plain_portfolio_amber.png`
- Robot assistant: `assets\robot-assistant-r2.png`
- Personal images: `assets\My Pictures\a1.png` through `a6.png`
- Mockups: `assets\Mockups`
- Automation evidence screenshots: `assets\automations`
- Office/tool logos: `assets\Logos`

Recently used personal images:

- `a1.png` in About/profile area
- `a2.png` in Working With Me
- `a4.png` in Process
- `a5.png` in Where Leads Get Stuck
- `a6.png` in Services

## Current Content / Copy Direction

Hero headline should stay:

`Building Intelligent Systems for Modern Business.`

Home tab section naming direction:

- `Where Leads Get Stuck`
- `What I Build in Your System`
- `How I Build Your System`
- `Capabilities & Tools`
- `Start Here`

The portfolio copy was reviewed using the user's copywriting skill folder:

`C:\Users\brade\Desktop\ChatGPT Master\Skill Builder\Skill-CopyWriting`

Tone direction:

- Clear, client-centered, practical
- Focus on lead problems, follow-up gaps, CRM/pipeline clarity, automation systems, and conversion paths
- Avoid sounding too abstract or too agency-generic

## Current Project Views

### Websites

Integrated website examples include:

- WeCare Dental
- NorthPeak Heating & Air
- Daily Reset Method

Cards open full internal previews in the site preview modal.

### Funnels

Integrated funnel examples include:

- WeCare Dental
- NorthPeak Heating & Air
- Daily Reset Method

Cards open full internal previews in the site preview modal.

### Design Mockups

This tab is for funnel/website mockups, not a separate "live preview" category.

Current mockups include:

- `assets\Mockups\DailyResetFunnel.png`
- `assets\Mockups\Dental Funnel Mockup.png`
- `assets\Mockups\HVAC Funnel Mockup.png`

The user wants these displayed professionally, not like generic framed cards.

### Automations

This tab contains sample automation systems. Keep the tab name `Automations`; do not rename it just to say "sample".

Automation cards open a fullscreen/cinematic system blueprint modal with:

- System heading
- Flow logic
- Modules
- Business impact
- GHL workflow evidence screenshots

Automation evidence uses real screenshots from `assets\automations`.

### Apps

Current app projects:

- Daily Dose of Knowledge
- Color Studio
- DailyGrace

Paths:

- `projects\applications\daily-dose-of-knowledge\index.html`
- `projects\applications\color-studio\index.html`
- `projects\applications\daily-grace\index.html`

Phone previews were carefully adjusted. Avoid casually refactoring the app phone preview CSS.

## KEN Robot Assistant

The floating robot assistant was renamed from JARVIS to KEN.

Behavior:

- Desktop: floating robot scans CTA targets.
- Mobile/touch: lightweight mobile robot link is used instead.
- Scanner should follow the CTA/button KEN is currently on.
- Movement timing was tuned: travel about 2s and hold about 1.5s.
- Avoid making KEN jumpy on scroll.
- Do not casually refactor this logic; it took many iterations.

## Recent Performance Pass

A performance optimization pass was completed while preserving the current visual experience.

Changes made in `concept-0-Nexus.html`:

- Added `rafThrottle()`.
- Added passive event options.
- Throttled scroll, resize, and mousemove work.
- Paused canvas loops when hidden, document is hidden, or modal/panel state makes them non-useful.
- Cached city skyline window positions instead of recalculating/randomizing every frame.
- Added intrinsic `width` and `height` to major images.
- Added loading/decoding/fetchpriority hints carefully.
- Preloaded only the hero logo.
- Added compositor hints for animated/scanner/robot elements.
- Reveal observer now unobserves elements after they appear.
- Removed a no-op parallax scroll listener.

Performance pass intentionally did not:

- Compress or convert image files, to avoid visual changes.
- Change fonts.
- Change animation timing.
- Change layout, copy, colors, sections, CTAs, or navigation behavior.
- Introduce a framework or build system.

Verification from the performance pass:

- Inline JS syntax check passed.
- Local asset/reference check passed.
- Browser render check passed on desktop and mobile for all views.
- Real content overflow check passed.
- One browser console message mentioned `MutationObserver`, but repo-wide search found no `MutationObserver` in the portfolio source; likely browser/tooling or preview-frame related.

## Current Fonts

Current Google Fonts request includes:

- Sora
- Inter
- Space Mono

Do not change fonts unless the user asks again.

## Contact / Form

Contact details in the portfolio:

- `bradecinagregkenneth@gmail.com`
- `+63 9158120390`
- `www.linkedin.com/in/gkbradecina`

Form endpoint:

- `https://formspree.io/f/mojbngwl`

Current form has:

- Required fields
- Min/max lengths
- Honeypot `_gotcha`
- Generic error message

Security/spam recommendation remains:

- If spam becomes a problem, enable Formspree spam controls and/or CAPTCHA/Turnstile provider-side. Do not fake spam protection only on the client.

## Verification Notes

Known commands/checks previously run:

- Inline script syntax check with Node
- Local asset/reference check
- Secret/API-key scans
- In-app browser render checks on desktop/mobile
- SPA view state checks for all views

The project folder is not a Git repo, so `git diff` and `git status` fail unless the user later initializes Git.

## Rules For Next Chat

Before editing:

1. Read this handoff file.
2. Inspect `concept-0-Nexus.html`.
3. If the task touches visuals, use the existing design language.
4. If the task touches JS/animations, keep changes small and verify syntax.
5. Preserve all current views, modals, links, CTAs, assets, and animations unless the user explicitly asks to change them.

Do not:

- Rebuild from scratch.
- Introduce a framework.
- Convert SPA tabs back to anchor scrolling.
- Remove KEN, scanner effects, canvas effects, or modals.
- Remove sections/features because they look heavy; optimize underneath instead.
- Casually rewrite the robot logic, app phone preview logic, or automation modal logic.

Suggested opening prompt for the next chat:

```text
We are continuing my portfolio project.

Project folder:
C:\Users\brade\Desktop\CodexChatGPTmy-app\Portfolio-concept-0-Nexus

Before doing anything, read:
C:\Users\brade\Desktop\CodexChatGPTmy-app\Portfolio-concept-0-Nexus\docs\HANDOFF-NEXT-CHAT.md

Then inspect:
C:\Users\brade\Desktop\CodexChatGPTmy-app\Portfolio-concept-0-Nexus\concept-0-Nexus.html

Continue from the current state and preserve the existing design, effects, layout, navigation, and content unless I ask otherwise.
```
