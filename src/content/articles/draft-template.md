---
title: Draft template (not published)
description: Unpublished template article so the draft flag can be verified. Filtered from production routes and the sitemap.
slug: draft-template
publishDate: 2026-09-01
pillar: getting-started
draft: true
---

This file is a **draft**. Production builds should not emit an HTML route for it.

Use it as a paste-template when you add a real article:

1. Duplicate this file
2. Set `draft: false` (or delete the field)
3. Change `slug`, `pillar`, dates, and body
4. Run `npm run build` and confirm the new static path exists under `dist/guides/`
