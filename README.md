# Oak-Pine Barrens Restoration Project

Public documentation site for a 40-acre privately owned oak-pine barrens restoration in Newaygo County, Michigan, supported by the [Lake States Fire Science Consortium (LSFSC)](https://lakestatesfirescience.org/) 2026 internship program.

**Live site:** https://karl-dykema.github.io/oak-pine-barrens/

---

## What this site does

- **Field Journal** — filterable markdown entries logging burn events, surveys, species observations, and project meetings
- **Photo Gallery** — documented photos linked to journal entries, filterable by author, date, species, and tags
- **Photo upload tool** — browser-based utility that compresses images (<1 MB), reads GPS from EXIF, detects duplicate uploads via perceptual hash, and generates a metadata JSON file ready to commit
- **Site map** — Leaflet map with satellite/street toggle centered on the restoration site
- **Team and About pages** — project context, ecology background, logging history, and key species

## Stack

- Vite 8 + React 19 + Tailwind CSS v3
- React Router v6, react-leaflet v5
- GitHub Pages hosting, deployed via GitHub Actions on every push to `main`
- Journal entries: markdown files with YAML front matter in `content/entries/`
- Photo metadata: JSON files in `data/photos/`, images in `public/photos/`

## Adding content

### Journal entries
Add a `.md` file to `content/entries/` with front matter:
```yaml
---
id: 2026-06-01-burn-day
title: Prescribed Burn — East Opening
date: 2026-06-01
author: karl
type: burn
tags: [fire, east-opening]
species: []
---
Entry body in markdown.
```

### Photos
1. Open the site and click **Upload Photo** on the Gallery page
2. Drop in a photo — it is compressed, GPS filled from EXIF, and a metadata file generated
3. Download both files and commit them:
   - `public/photos/<id>.jpg`
   - `data/photos/<id>.json`

## Local development

```bash
npm install
npm run dev
```

Build and preview:
```bash
npm run build    # outputs to dist/ and copies 404.html for SPA routing
npm run preview
```

## Deployment

Pushes to `main` automatically trigger a GitHub Actions build and deploy to the `gh-pages` branch. No manual steps needed.
