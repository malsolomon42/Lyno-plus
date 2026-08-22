---
name: Stripe sync migrations
description: Stripe webhook sync initialization in bundled API servers
---

When using stripe-replit-sync in a bundled API server, include the package's migration assets beside the runtime bundle before calling runMigrations.

**Why:** The package resolves its migrations directory relative to the bundled runtime; without copied assets, startup reports missing stripe tables even though runMigrations was called.

**How to apply:** Copy the installed stripe-replit-sync migrations directory into the server dist output during the build step, then initialize migrations before managed webhooks or backfill.