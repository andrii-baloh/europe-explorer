# Европа — дневник исследователя

Browser-based geography course, grade 6: Russian explanations and German terms. React + TypeScript + Tailwind, OpenLayers, Recharts. No backend, accounts, analytics or runtime API keys.

## Current educational course (NRW G9)

- Public game: https://andrii-baloh.github.io/europe-explorer/?course
- 12 modules and 60 bilingual episodes; original five interactive scenes preserved.
- Module 1: 15 map-detective tasks + 5 lesson checkpoints.
- Modules 2–12: 165 scenario classifications, 55 case decisions and 55 lesson checkpoints.
- Progress counts only after the complete interactive practice and checkpoint.
- Local progress, journal notes, portable JSON backup/restore, TXT export; no authentication.
- Six types of topic-specific semantic diagrams and special exact numerical illustrations.
- Video embeds load only after the learner agrees to start a source-hosted video.
- Current alignment and important limits: docs/CURRICULUM_NRW_G9.md.
## Run

Node.js 22.12+ or 24.

```sh
npm ci
npm run dev
```

## Verify and build

```sh
npm test
npm run build
```

`dist/` is a static website. Scenes are lazy loaded. Geography is a locally bundled Natural Earth 1:110m subset. No external map tile calls.

## Publish on GitHub Pages

1. Create a new public repository `europe-explorer` in your GitHub account, without initial files.
2. Push this source directory (including `.github/workflows/pages.yml` and `package-lock.json`) to its `main` branch.
3. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
4. Actions → Publish Europe Explorer → Run workflow (or push a new commit).
5. Open the URL reported by the successful deployment. Relative asset paths support a repository subpath.

Example commands, for the connected account confirmed during preparation:

```sh
git init -b main
git add .
git commit -m "Build Europe geography learning app"
git remote add origin https://github.com/andrii-baloh/europe-explorer.git
git push -u origin main
```

This repository is live at https://andrii-baloh.github.io/europe-explorer/ . The source is maintained on the main branch.

## What is included

- Five interactive chapters: country map, climate lab, farm, Alps and transport/tourism.
- Russian explanations, German vocabulary, hints and a journal; no scores or timer.
- Strict paired temperature/precipitation domains (1:2), aligned zero, including negative temperatures. Linear precipitation scale throughout, not the compressed >100 mm convention of some textbook diagrams.
- Explicitly illustrative climate data (not claimed to be real city climate normals).
- Validated, versioned diary JSON import with additive deduplication; JSON and TXT download in every chapter and diary. Browser storage errors are surfaced.
- Responsive CSS, keyboard-friendly controls and a country select alternative to map clicking.

## Content boundaries

This is an introductory interactive course, not an exhaustive implementation of every school's curriculum. The map is generalized and omits some microstates. Country details cover selected destinations; other selections prompt atlas exploration. Physical relief is explained but not a separate raster map layer. Climate datasets are synthetic teaching examples. Farm and tourism scenes are qualitative or explicitly hypothetical models. No city reanalysis dataset has been incorporated.

The diary is local to the site origin and browser. Clearing site data or changing domains requires restoring a downloaded JSON. TXT is for reading, not re-import. Import max: 1 MB, 300 entries; schema is checked before current data is changed.

## Data preparation and attribution

Natural Earth source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

Downloaded 2026-11-03. Run `python3 scripts/prepare-map.py /path/to/source.geojson` to regenerate the European subset. The script explicitly reattributes the source's separate Crimea polygon to Ukraine; it fails for unexpected topology. Natural Earth small-scale boundaries are generalized and not legal boundary guidance.

See THIRD_PARTY.md for licenses and educational sources. Source code is formatted using Prettier before delivery.


## Иллюстрированная версия

В `public/art/*.webp` — оригинальные стилизованные изображения экспедиций с юным исследователем. Это сюжетные иллюстрации, а не точные географические карты или графики; учебные значения берутся только из интерактивных сцен. Фотографии ребёнка не включены в публичный репозиторий. Картинки содержат художественный образ, созданный по разрешению пользователя. Все ассеты локальные, без внешних запросов.
