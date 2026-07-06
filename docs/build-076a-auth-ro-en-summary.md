# BUILD #076A — Auth RO/EN hero sync

## Scope

This build fixes the remaining language mismatch on auth pages.

## Changes

- `/login` page now renders the hero panel through a client component using `useAppLanguage()`.
- `/register` page now renders the hero panel through a client component using `useAppLanguage()`.
- Login and register hero copy now follows the same saved/browser language preference as the forms.
- Adds a production RO/EN QA checklist.
- Adds a VPS live QA script for public routes, legal placeholder checks, API health, sitemap, robots and fresh logs.

## Out of scope

- No API changes.
- No database changes.
- No environment variable changes.
- No billing or Stripe behavior changes.
- No protected app feature changes.

## Validation after deploy

Run on VPS:

```bash
sh scripts/vps-ro-en-live-qa.sh
```

Then manually verify:

- RO switch shows Romanian copy on homepage, pricing, demo, legal, login and register.
- EN switch shows English copy on homepage, pricing, demo, legal, login and register.
- Refresh keeps the selected language.
