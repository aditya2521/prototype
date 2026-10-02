# Chinstrap web prototype — design QA

## Audit scope

- Public landing journey, sign-in entry, authenticated member home, responsive navigation, and Insight AI pricing.
- Original `chinstrap` and `chinstrap-mobile` projects were reviewed as read-only product references. All implementation work is isolated to `chinstarp-web`.
- Accessibility review is limited to visible hierarchy, reflow, labels, focusable controls, and DOM accessibility names; this is not a full WCAG conformance audit.

## Source and before-state evidence

- Current landing before this iteration: `../audit-chinstrap-web/screenshots/01-current-landing.png`
- Current private home before this iteration: `../audit-chinstrap-web/screenshots/02-current-private-home.png`
- User-supplied original-site references: asymmetric editorial discovery, human story imagery, and local program discovery.
- Original product source reviewed for role-aware onboarding, school/sport verification, reviews, community, network, tournaments, messaging, Insight AI, plans, and account management.

## Implementation evidence

1. `03-redesigned-landing.png` — cinematic landing hero and integrated center logo; healthy.
2. `04-decision-playground.png` — original decision-based exploration system; healthy.
3. `05-signal-wall.png` — live community signal wall; healthy.
4. `06-redesigned-private-home.png` — consumer member home with AI, discovery, community, verification, events, messages, reviews, and plans; healthy.
5. `07-mobile-private-home-final.png` — mobile member home after duplicate-navigation correction; healthy.
6. `08-mobile-insight-plans.png` — Insight AI analysis, credit packs, and subscriptions; healthy.
7. `12-refined-product-nav-reference-size.png` — authenticated application navigation at the reference-proportioned 1470 × 956 viewport; healthy.
8. `13-logo-scrolled-reference-size-final.png` — compact public sticky-header logo at the supplied 1078 × 858 viewport; healthy.

All evidence is stored in `../audit-chinstrap-web/screenshots/`.

## Findings and changes

- The original website’s visual energy was used as a benchmark, not copied. The new landing introduces three distinct concepts: a question-led decision playground, a live community signal wall, and an explainable AI match lab.
- The center brand is structurally integrated with the hero notch and no longer appears pasted over the image.
- Landing navigation now points to public product features: Home, Community, Explore, How it works, Insight AI, and Pricing.
- The personalized visual member home is retained. Per subsequent user feedback, authenticated navigation is now a left sidebar, separate from public landing navigation.
- Key tasks are visible at entry: ask Insight AI, explore programs, finish verification, open messages, view events, compare saved programs, and write reviews.
- AI is represented as a product journey, not a single card: explainable fit, development priorities, match ranking, credit balance, one-time packs, monthly subscriptions, and history.
- Desktop was checked at 1440 × 1024; mobile at 390 × 844. Both report viewport-width body layouts without horizontal overflow.
- Mobile initially exposed two overlapping navigation layers. The older app navigation was retained and the duplicate product navigation was removed at mobile sizes.
- A missing favicon was the only observed resource warning and was corrected by adding the local Chinstrap mark.
- The landing logo now changes from its oversized hero-notch presentation to a compact sticky-header lockup after 40px of scroll. It remains fully contained instead of extending over page content.
- The authenticated navigation was refined to match the supplied professional reference: clearer active pills, stronger icon/text spacing, separated utility actions, compact account controls, and a balanced search/action row.
- The 721–1180px breakpoint was corrected so the public brand stays mathematically centered and the menu stays right-aligned.

## Verification

- Production build: passed.
- Sites worker tests: 4/4 passed.
- Sign-in gate and prototype social sign-in: passed.
- Landing anchor navigation: passed.
- Authenticated home, mobile reflow, Insight navigation, and pricing visibility: passed.
- Original `chinstrap` and `chinstrap-mobile` working trees were not modified by this redesign.

## Role-specific onboarding update

- Five separate six-step journeys now cover Athlete, Parent / guardian, Coach / director, Agent / advisor, and Organization.
- Profile fields, discovery context, invitations, verification evidence, plan choices, privacy settings, and sidebar guidance change with the selected role.
- School/college context is optional for athletes. Parents are not asked for a child's identity or school details. Professional and organization flows use experience, services, affiliation, and ownership instead.
- Role drafts remain separate in memory while switching roles. They are not persisted across page reloads. Invitations, document verification, and paid plans are explicitly simulated.
- `node tests/onboarding-browser.mjs` passed all 90 role/step/viewport combinations at 1470px, 768px, and 390px, with no horizontal page overflow or JavaScript exceptions. It also checked input labels, back/skip, invitation preview, evidence selection, role draft isolation, completion, logout, and the sign-in gate.
- Visually inspected the updated role picker, desktop organization profile, and mobile coach-verification screen. Evidence: `../audit-chinstrap-web/screenshots/24-role-specific-onboarding.png`; additional test captures are generated in `/tmp/chinstrap-organization-profile.png` and `/tmp/chinstrap-mobile-coach-verification.png`.
- Production build and all four Sites worker tests passed.

final result: passed for the tested prototype flows; not production authentication, payments, or verification.
