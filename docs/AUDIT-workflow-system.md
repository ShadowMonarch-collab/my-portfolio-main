# System Automations Workflow Audit

Saved for later review. This audit covers the ten GoHighLevel workflow concepts currently represented in the portfolio.

## Overall Assessment

The workflow set forms a credible lifecycle system:

```text
Lead Intake
  -> Appointment Booked
  -> Treatment In Progress
  -> Completed Treatment
  -> Feedback / Reputation

Lead Intake
  -> Active Nurture
  -> Cold Nurture
  -> Inactive Lead

Canceled / No Show
  -> Recovery
  -> Rebooked OR Active Nurture
```

The design needs further work before production use, especially around review routing, workflow removal scope, stage handoffs, tag cleanup, and compliance.

## Priority Findings

| Severity | Finding | Recommended Revision |
| --- | --- | --- |
| High | Google/Facebook `Review Received` triggers may be contactless, preventing contact-tag and direct follow-up actions from working as planned. | Confirm a contact-linked review source or route through a private contact-linked satisfaction step first. |
| High | Review requests are sent before identifying unhappy patients. | Add a private satisfaction gateway: positive responses receive public review requests; negative responses enter service recovery. |
| High | `APPT` removes contacts from all other workflows. | Remove only conflicting lead, nurture, or recovery workflows so legitimate service and retention journeys are not interrupted. |
| High | No defined system sets `Treatment In Progress` or `Closed Won`. | Define staff stage-update rules or add appointment/status automations that explicitly make those pipeline transitions. |
| Medium | Status/history tags can accumulate and conflict. | Create a tag lifecycle matrix describing what is retained or removed at each transition. |
| Medium | Active nurture marks contacts `Closed Lost` before cold reactivation is complete. | Route to a `Cold Nurture` or `Long-Term Follow-Up` stage; reserve `Closed Lost` for final inactivity. |
| Medium | Negative review recovery stops after internal notification. | Add task ownership, response SLA, recovery follow-up, resolution tracking, and closure logic. |
| Medium | No-show recovery depends on re-entry into active nurture. | Confirm workflow re-entry configuration or build a dedicated unrecovered no-show nurture path. |
| Medium | Cold nurture includes an undefined recurring monthly content step. | Specify cadence, message types, maximum duration, booking goal, and final exit rule. |
| Medium | SMS/email consent, DND, and patient information safeguards are not specified. | Configure consent capture, messaging compliance, DND handling, and privacy-safe outbound content. |

## Recommended Architecture Changes

1. Keep `LEAD - New Inquiry Intake`, adding duplicate-entry protection and a defined cleanup rule for intake tags.
2. Keep `APPT - Booking Confirmation & Reminders`, but replace broad workflow removal with targeted removals.
3. Route failed `NURTURE - Active Leads` contacts into a cold-nurture stage rather than `Closed Lost`.
4. Make `NURTURE - Cold Leads` finite or formally recurring, with an explicit inactive exit.
5. Ensure a successful rebooking immediately stops `RECOVERY - No Show / Cancel` and enters appointment reminders.
6. Define who or what advances patients to `Treatment In Progress` and `Closed Won`.
7. Add a private feedback gateway before public review requests.
8. Expand negative experience recovery into an assigned and tracked resolution process.

## Proposed Reputation Routing

```text
Experience Feedback Request
  -> Private satisfaction response
      -> Positive: Public Review + Referral Path
      -> Negative: Service Recovery Path
```

## HighLevel References

- [Review Received trigger for Google and Facebook reviews](https://help.gohighlevel.com/support/solutions/articles/155000003873-how-to-setup-workflow-triggers-for-google-and-facebook-reviews)
- [Goal Event workflow action](https://help.gohighlevel.com/support/solutions/articles/155000003328-workflow-action-goal-event)
- [Remove from Workflow action](https://help.gohighlevel.com/support/solutions/articles/155000002553-action-remove-from-workflow)
- [Workflow settings and re-entry](https://help.gohighlevel.com/support/solutions/articles/48001239875-workflow-settings-overview/)
- [SMS compliance settings](https://help.gohighlevel.com/support/solutions/articles/155000004684)
- [Do Not Disturb handling](https://help.gohighlevel.com/support/solutions/articles/48001214849)

