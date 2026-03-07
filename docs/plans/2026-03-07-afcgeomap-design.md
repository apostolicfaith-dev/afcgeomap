# AFC GeoMap — Design Document

**Date:** 2026-03-07
**Status:** Approved

## Overview

Interactive world map visualizing Apostolic Faith Church (AFC) magazine articles by geographic location. Users can explore articles by clicking pins on the map, filtering by article type and decade.

**Data source:** https://www.apostolicfaith.org/magazine-sections/

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (no build step)
- **Map**: Leaflet.js + CartoDB Voyager tiles (warm, classic tone)
- **Clustering**: leaflet.markercluster plugin
- **Data**: Static JSON files (`articles.json`, `locations.json`)
- **Hosting**: Cloudflare Pages (static deployment)
- **Branding**: AFC logo + homepage color palette (#6e7488 muted blue-gray, warm classic tone)

## Data Structure

### articles.json

```json
{
  "id": "a-heart-for-haiti",
  "title": "A Heart for Haiti",
  "author": "Rolland Deler",
  "date": "2025-11-03",
  "decade": "2020s",
  "type": "witness",
  "url": "https://www.apostolicfaith.org/the-apostolic-faith/a-heart-for-haiti",
  "locations": ["haiti", "portland-or"],
  "summary": "From idol worship in Haiti to establishing 30 AFC congregations..."
}
```

### locations.json

```json
{
  "id": "haiti",
  "name": "Haiti",
  "lat": 18.9712,
  "lng": -72.2852,
  "country": "Haiti"
}
```

## Pin Mapping Logic

- **World Report** → mapped to locations mentioned in the article
- **Witness, Viewpoint, From the Word, Our Classics** → mapped to author's activity city from bio
- A single article can map to **multiple locations**

## UI Layout

```
┌─────────────────────────────────────────────┐
│  [AFC Logo]  AFC GeoMap            [Filters] │
├─────────────────────────────────────────────┤
│                                             │
│            ◀ Interactive Map ▶              │
│                                             │
│        (12)          (5)                    │
│     Portland     ·  Haiti                   │
│                        (23)                 │
│                      Nigeria                │
│                                    (8)      │
│                                  India      │
│                                             │
├─────────────────────────────────────────────┤
│  Filter: [All Types ▼] [All Decades ▼]     │
│  Showing 847 articles across 94 locations   │
└─────────────────────────────────────────────┘
```

### Pin Click Panel

- Opens a side panel or popup listing articles for that location
- **Max height constrained** with scroll for long lists
- **Sort options**: Newest first / Oldest first
- Each article entry shows: title, author, date, type badge, link to original

```
┌──────────────────────────┐
│ Portland, OR, USA        │
│ 12 articles  [Sort: ▼]  │
├──────────────────────────┤
│ ● A Heart for Haiti      │ ▲
│   Rolland Deler           │ │
│   Nov 2025 · Witness      │ │ scrollable
│   [→ Read article]        │ │
│                           │ │
│ ● Joy Full Living         │ │
│   Ed R. Habre             │ ▼
└──────────────────────────┘
```

## Filters

- **Article type**: All / Viewpoint / From the Word / Witness / World Report / Our Classics
- **Decade**: All / 1960s-70s / 1980s / 1990s / 2000s / 2010s / 2020s
- Filters update map pins in real-time
- Status bar shows count: "Showing X articles across Y locations"

## Crawling Workflow

1. **Collect links**: Scrape article listing pages for all 5 sections → `data/raw/article-links.json`
2. **Crawl articles**: Fetch individual article pages in batches of 10-20 → extract metadata
3. **Normalize locations**: Map author locations to standardized city/coordinates
4. **Generate output**: Produce final `articles.json` + `locations.json`
5. **Track progress**: `data/raw/crawl-progress.json` for resumable batch processing

Crawling is done periodically (magazine publishes quarterly). Workflow documented in `crawl/workflow.md`.

## Project Structure

```
afcgeomap/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js          # Main app initialization
│   ├── map.js          # Leaflet map setup and control
│   └── filters.js      # Filter UI logic
├── data/
│   ├── articles.json   # Crawled article data (deployed)
│   ├── locations.json  # City coordinates (deployed)
│   └── raw/            # Crawling intermediate data (gitignored)
├── assets/
│   └── logo.png
├── docs/
│   └── plans/
└── crawl/
    └── workflow.md     # Crawling workflow documentation
```

## Scope Exclusions (Future Work)

- Multilingual UI
- Search functionality (by author name, keyword)
- Timeline animation (pins appearing by year)
- Automated crawl scheduling
