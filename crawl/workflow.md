# AFC GeoMap - Crawling Workflow

## Overview

Batch-process articles from https://www.apostolicfaith.org/magazine-sections/
into structured JSON data for the map.

## Phase 1: Collect Article Links

For each section (viewpoint, from-the-word, witness, world-report, our-classics):
1. Fetch the section listing page
2. Extract all article links and basic metadata (title, date, author if shown)
3. Handle "load more" pagination to get all articles
4. Save to `data/raw/article-links.json`

## Phase 2: Crawl Individual Articles (Batch 10-20)

For each article link:
1. Fetch the article page
2. Extract: title, author, author bio, date, section type, full text
3. Save raw data to `data/raw/articles-raw.json`
4. Track progress in `data/raw/crawl-progress.json`

Process in batches of 10-20 articles per session to stay within token limits.

## Phase 3: Extract Locations

For each article:
- **World Report**: Extract location names from title and content
- **Other types**: Extract author's activity city from bio text
- Normalize location names to standardized IDs
- Map to coordinates (use geocoding or manual lookup)

Save location mappings to `data/raw/location-mappings.json`.

## Phase 4: Generate Final Data

1. Merge article metadata + location mappings
2. Output `data/articles.json` (deployed)
3. Output `data/locations.json` (deployed)
4. Validate: no orphan location references, all coords valid

## Progress Tracking

`data/raw/crawl-progress.json`:
```json
{
  "phase": "2",
  "totalLinks": 350,
  "crawled": 120,
  "lastBatch": "2026-03-07",
  "errors": []
}
```

## Maintenance

Magazine publishes quarterly. Run Phase 1 to check for new articles,
then process only new ones through Phases 2-4.
