# SHOT LIST — Backline Events Co. funnel

Every image slot on the page, with the filename it must be saved as. Drop a replacement
into `assets/` under the exact filename and it appears automatically.

**The five images currently in `assets/` are free Unsplash stock, used as a stand-in so the
demo reads as finished. They are not the deliverable.** Replace all five with real Backline
event photography before launch. Never ship stock as final, and never hotlink in production.

| # | Filename | Slot | Subject brief | Ratio |
|---|----------|------|----------------|-------|
| 1 | `assets/bg-hero-tent-dusk.jpg` | Hero section background (**REQUIRED**, full-bleed under a directional scrim) | Wide, atmosphere-first frame of an event at dusk. Environment leads, faces secondary, soft focus fine. Needs dark values on the left two thirds so the copy column stays legible, and enough light on the right for the image to breathe through the scrim. | 16:9 or wider, min 2400px |
| 2 | `assets/crew-onsite-staff.jpg` | Hero content image (right column on desktop) | The on-site team in motion during load-in or service: coordinators in Backline blacks, moving with purpose. Calm competence, not chaos. Crew visibly in command of the room. | 4:5 portrait, min 1600px |
| 3 | `assets/plan-evening-service.jpg` | The Run Book section, inside the lead column | An event running exactly on time: service in progress, guests seated, the timeline visibly holding. This is the picture of the plan working. | 3:2 landscape, min 1900px |
| 4 | `assets/floor-banquet-service.jpg` | On-Site Command section, full-width band below the roster | The floor mid-service from a wide angle, coordinators visible working between tables. Shows the scale a three-person command team actually covers. | 21:9 letterbox crop, min 1900px |
| 5 | `assets/bg-close-toast.jpg` | Final close background (**REQUIRED**, full-bleed under a stronger accent-tinted scrim) | The emotional payoff and the hero's bookend: the client enjoying their own event. A toast, a full room, warm light. Same visual family as shot #1 so the page closes where it opened. | 16:9 or wider, min 2400px |

Also in `assets/`: `logo-backline-mark.svg`, the offset-squares mark used as the favicon.
The full lockup is inline SVG in the nav and footer, so it stays crisp and recolours with
`currentColor`.

## Notes for the photographer

- Shots #1 and #5 sit under palette-tinted gradient scrims, so mid-contrast frames are fine.
  Legibility is handled in CSS. Avoid busy highlights in the left third of #1.
- Shots #2, #3 and #4 render large. Use the highest-resolution frames available.
- **No third-party brand marks in frame.** Sponsor logos, vendor branding, and labelled crew
  vests from other companies all had to be rejected while sourcing the stand-ins.
- Faces of real guests need a release before they go on a public page.

## Current stand-in credits (Unsplash, free licence)

| Slot | Unsplash photo ID |
|---|---|
| 1 | `photo-1635510237955-7ab6b6e63af2` |
| 2 | `photo-1641122669951-3e2aff778d3b` |
| 3 | `photo-1574482211311-45a2169db57c` |
| 4 | `photo-1651313948618-31644c7fec18` |
| 5 | `photo-1527529482837-4698179dc6ce` |
