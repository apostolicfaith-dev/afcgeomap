# AFC GeoMap

Interactive world map visualizing [Apostolic Faith Church](https://www.apostolicfaith.org/) magazine articles by geographic location.

**Live site:** https://apostolicfaith-dev.github.io/afcgeomap/

## Stack

- Vanilla HTML/CSS/JS (no build step)
- Leaflet.js + CartoDB Voyager tiles
- Static JSON data (`data/articles.json`, `data/locations.json`)
- GitHub Pages (auto-deploy on push to main)

## Data

- 451 articles (as of Mar 2026)
- 75 locations across 30+ countries
- 5 sections: Viewpoint, From the Word, Witness, World Report, Our Classics

## TODO

### Quarterly article update

New articles are published quarterly at apostolicfaith.org. To check and add them:

1. **Fetch current article links** from all 5 section pages and compare against `data/raw/article-queue.json` (451 articles) to find new ones
2. **Crawl new articles** — extract title, author, authorPhoto, date, type, summary from each article page
3. **Map locations** — extract author's city from bio text (max 3 locations per article, priority: author base city > story locations)
4. **Add new location entries** to `data/locations.json` if needed (with lat/lng/country)
5. **Merge into `data/articles.json`** (sorted by date, newest first) and push to main

See `crawl/workflow.md` for detailed crawling process.
