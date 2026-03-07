# AFC GeoMap Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive world map that displays AFC magazine articles as geographic pins, with filtering by article type and decade.

**Architecture:** Static SPA with no build step. Leaflet.js renders the map with clustered markers. Article and location data live in JSON files fetched at load time. Filters dynamically update visible pins.

**Tech Stack:** Vanilla HTML/CSS/JS, Leaflet.js, leaflet.markercluster, CartoDB Voyager tiles, Cloudflare Pages

---

### Task 1: Project Scaffold

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/app.js`

**Step 1: Create index.html with Leaflet CDN and basic layout**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AFC GeoMap</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header id="header">
    <div class="header-left">
      <img src="assets/logo.png" alt="AFC Logo" class="logo" />
      <h1>AFC GeoMap</h1>
    </div>
    <div class="header-right" id="filters"></div>
  </header>
  <main>
    <div id="map"></div>
  </main>
  <footer id="status-bar">
    <span id="status-text">Loading...</span>
  </footer>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
  <script src="js/map.js"></script>
  <script src="js/filters.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

**Step 2: Create css/style.css with base layout**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Open Sans', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #333;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #3b3f51;
  color: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo { height: 36px; }

#header h1 {
  font-size: 1.2rem;
  font-weight: 600;
}

main { flex: 1; position: relative; }

#map { width: 100%; height: 100%; }

#status-bar {
  padding: 6px 16px;
  background: #f5f0eb;
  font-size: 0.85rem;
  color: #6e7488;
  border-top: 1px solid #ddd;
}
```

**Step 3: Create js/app.js stub**

```js
// AFC GeoMap - Main Application
(async function () {
  'use strict';

  const articlesResp = await fetch('data/articles.json');
  const locationsResp = await fetch('data/locations.json');
  const articles = await articlesResp.json();
  const locations = await locationsResp.json();

  const map = AFCMap.init('map');
  AFCMap.loadPins(map, articles, locations);
  AFCFilters.init(articles, locations, map);
})();
```

**Step 4: Verify - open index.html in browser**

Expected: page loads with header, empty map area, status bar. Console may show fetch errors (no data yet) - that's fine.

**Step 5: Commit**

```bash
git add index.html css/style.css js/app.js
git commit -m "feat: project scaffold with HTML/CSS/JS skeleton"
```

---

### Task 2: Map Initialization

**Files:**
- Create: `js/map.js`

**Step 1: Create js/map.js with Leaflet setup**

```js
// AFC GeoMap - Map Module
const AFCMap = (function () {
  'use strict';

  function init(elementId) {
    const map = L.map(elementId, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      worldCopyJump: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    return map;
  }

  function loadPins(map, articles, locations) {
    // Placeholder - implemented in Task 4
  }

  return { init, loadPins };
})();
```

**Step 2: Verify - open in browser**

Expected: full-screen world map with warm CartoDB Voyager tiles, centered on the world, zoomable.

**Step 3: Commit**

```bash
git add js/map.js
git commit -m "feat: Leaflet map with CartoDB Voyager tiles"
```

---

### Task 3: Sample Data

**Files:**
- Create: `data/articles.json`
- Create: `data/locations.json`
- Create: `js/filters.js` (stub)

**Step 1: Create data/locations.json with 5 sample locations**

```json
[
  { "id": "portland-or", "name": "Portland, OR", "lat": 45.5152, "lng": -122.6784, "country": "USA" },
  { "id": "haiti", "name": "Haiti", "lat": 18.9712, "lng": -72.2852, "country": "Haiti" },
  { "id": "lagos-ng", "name": "Lagos", "lat": 6.5244, "lng": 3.3792, "country": "Nigeria" },
  { "id": "andhra-pradesh-in", "name": "Andhra Pradesh", "lat": 15.9129, "lng": 79.7400, "country": "India" },
  { "id": "st-louis-mo", "name": "St. Louis, MO", "lat": 38.6270, "lng": -90.1994, "country": "USA" }
]
```

**Step 2: Create data/articles.json with 8 sample articles**

```json
[
  {
    "id": "saints-in-east-india",
    "title": "Saints in East India: Steadfast, Unmovable, Abounding",
    "author": "",
    "date": "2026-02-02",
    "decade": "2020s",
    "type": "world-report",
    "url": "https://www.apostolicfaith.org/the-apostolic-faith/saints-in-east-india-steadfast-unmovable-abounding",
    "locations": ["andhra-pradesh-in"],
    "summary": "Visitors from outside India travelled to churches in the Andhra Pradesh region."
  },
  {
    "id": "a-heart-for-haiti",
    "title": "A Heart for Haiti",
    "author": "Rolland Deler",
    "date": "2025-11-03",
    "decade": "2020s",
    "type": "witness",
    "url": "https://www.apostolicfaith.org/the-apostolic-faith/a-heart-for-haiti",
    "locations": ["haiti", "portland-or"],
    "summary": "From idol worship in Haiti to establishing 30 AFC congregations."
  },
  {
    "id": "dedicated-and-rededicated-in-st-louis",
    "title": "Dedicated and Rededicated in St. Louis",
    "author": "",
    "date": "2025-04-08",
    "decade": "2020s",
    "type": "world-report",
    "url": "https://www.apostolicfaith.org/the-apostolic-faith/dedicated-and-rededicated-in-st-louis",
    "locations": ["st-louis-mo"],
    "summary": "The St. Louis congregation rejoiced after God returned their church building."
  },
  {
    "id": "a-worker-for-god",
    "title": "A Worker for God",
    "author": "Lordick Motshidisi",
    "date": "2026-02-02",
    "decade": "2020s",
    "type": "witness",
    "url": "https://www.apostolicfaith.org/the-apostolic-faith/a-worker-for-god",
    "locations": ["lagos-ng"],
    "summary": "A testimony of faith and service from Nigeria."
  },
  {
    "id": "god-speaks-are-you-listening",
    "title": "God Speaks... Are You Listening?",
    "author": "Dwight Baltzell",
    "date": "2026-02-24",
    "decade": "2020s",
    "type": "from-the-word",
    "url": "https://www.apostolicfaith.org/the-apostolic-faith/god-speaks-are-you-listening",
    "locations": ["portland-or"],
    "summary": "Hearing from God is not processing audible sounds, but opening our hearts to His words."
  },
  {
    "id": "joy-full-living",
    "title": "Joy Full Living",
    "author": "Ed R. Habre",
    "date": "2026-01-19",
    "decade": "2020s",
    "type": "from-the-word",
    "url": "https://www.apostolicfaith.org/the-apostolic-faith/joy-full-living",
    "locations": ["portland-or"],
    "summary": "Four keys to joy that abides regardless of life's circumstances."
  },
  {
    "id": "out-of-islam",
    "title": "Out of Islam",
    "author": "Joseph Ampofo Ansah",
    "date": "2025-06-09",
    "decade": "2020s",
    "type": "witness",
    "url": "https://www.apostolicfaith.org/the-apostolic-faith/out-of-islam",
    "locations": ["lagos-ng"],
    "summary": "A testimony of leaving Islam and finding faith in Christ."
  },
  {
    "id": "sowing-seeds-in-south-america",
    "title": "Sowing Seeds in South America",
    "author": "",
    "date": "2025-08-12",
    "decade": "2020s",
    "type": "world-report",
    "url": "https://www.apostolicfaith.org/the-apostolic-faith/sowing-seeds-in-south-america",
    "locations": ["lagos-ng", "portland-or"],
    "summary": "Reports from AFC mission work across South America."
  }
]
```

**Step 3: Create js/filters.js stub**

```js
// AFC GeoMap - Filters Module
const AFCFilters = (function () {
  'use strict';

  function init(articles, locations, map) {
    updateStatus(articles, locations);
  }

  function updateStatus(articles, locations) {
    const el = document.getElementById('status-text');
    const locCount = new Set(articles.flatMap(a => a.locations)).size;
    el.textContent = `Showing ${articles.length} articles across ${locCount} locations`;
  }

  return { init };
})();
```

**Step 4: Verify - open in browser**

Expected: map loads, status bar shows "Showing 8 articles across 5 locations", no console errors.

**Step 5: Commit**

```bash
git add data/articles.json data/locations.json js/filters.js
git commit -m "feat: sample data and filters stub with status bar"
```

---

### Task 4: Map Pins with Clustering

**Files:**
- Modify: `js/map.js`

**Step 1: Implement loadPins and clearPins in map.js**

Replace the `loadPins` placeholder:

```js
let clusterGroup = null;

function loadPins(map, articles, locations) {
  if (clusterGroup) {
    map.removeLayer(clusterGroup);
  }

  const locMap = Object.fromEntries(locations.map(l => [l.id, l]));
  const pinData = {};

  articles.forEach(article => {
    article.locations.forEach(locId => {
      if (!locMap[locId]) return;
      if (!pinData[locId]) pinData[locId] = { location: locMap[locId], articles: [] };
      pinData[locId].articles.push(article);
    });
  });

  clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false
  });

  Object.values(pinData).forEach(({ location, articles }) => {
    const marker = L.marker([location.lat, location.lng]);
    marker.bindPopup(() => buildPopup(location, articles));
    marker.bindTooltip(`${location.name} (${articles.length})`, { direction: 'top', offset: [0, -10] });
    clusterGroup.addLayer(marker);
  });

  map.addLayer(clusterGroup);
}

function buildPopup(location, articles) {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const typeLabels = {
    'viewpoint': 'Viewpoint',
    'from-the-word': 'From the Word',
    'witness': 'Witness',
    'world-report': 'World Report',
    'our-classics': 'Our Classics'
  };

  const listHtml = sorted.map(a => `
    <div class="popup-article">
      <div class="popup-article-title">${a.title}</div>
      <div class="popup-article-meta">
        ${a.author ? a.author + ' · ' : ''}${formatDate(a.date)} · <span class="type-badge type-${a.type}">${typeLabels[a.type] || a.type}</span>
      </div>
      <a href="${a.url}" target="_blank" rel="noopener" class="popup-article-link">Read article →</a>
    </div>
  `).join('');

  return `
    <div class="popup-container">
      <div class="popup-header">
        <strong>${location.name}</strong>
        <span>${sorted.length} article${sorted.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="popup-list">${listHtml}</div>
    </div>
  `;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
```

Export `loadPins` in the return statement (already done).

**Step 2: Verify - open in browser**

Expected: 5 pins on the map (Portland, Haiti, Lagos, Andhra Pradesh, St. Louis). Clusters form when zoomed out. Click a pin → popup with article list. Hover → tooltip with city name and count.

**Step 3: Commit**

```bash
git add js/map.js
git commit -m "feat: map pins with clustering and popup panels"
```

---

### Task 5: Popup Styling

**Files:**
- Modify: `css/style.css`

**Step 1: Add popup styles to style.css**

```css
/* Popup */
.popup-container { width: 280px; }

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0dbd5;
  margin-bottom: 8px;
}

.popup-header strong { font-size: 1rem; color: #3b3f51; }
.popup-header span { font-size: 0.8rem; color: #6e7488; }

.popup-list {
  max-height: 250px;
  overflow-y: auto;
}

.popup-article {
  padding: 8px 0;
  border-bottom: 1px solid #f0ebe5;
}

.popup-article:last-child { border-bottom: none; }

.popup-article-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 3px;
}

.popup-article-meta {
  font-size: 0.78rem;
  color: #6e7488;
  margin-bottom: 4px;
}

.popup-article-link {
  font-size: 0.78rem;
  color: #5b6abf;
  text-decoration: none;
}

.popup-article-link:hover { text-decoration: underline; }

/* Type badges */
.type-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
}

.type-viewpoint { background: #e8e0f0; color: #6b4c9a; }
.type-from-the-word { background: #dce8dc; color: #3d6b3d; }
.type-witness { background: #e0e8f0; color: #4a6b8a; }
.type-world-report { background: #f0e8dc; color: #8a6b3d; }
.type-our-classics { background: #f0dce0; color: #8a3d4a; }

/* Leaflet popup overrides */
.leaflet-popup-content-wrapper {
  border-radius: 8px;
  box-shadow: 0 3px 14px rgba(0,0,0,0.15);
}

.leaflet-popup-content { margin: 12px; }
```

**Step 2: Verify - click a pin**

Expected: styled popup with scrollable article list, type badges in muted colors, clean layout.

**Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: popup panel styling with type badges and scroll"
```

---

### Task 6: Sort Control in Popup

**Files:**
- Modify: `js/map.js`

**Step 1: Add sort toggle to buildPopup**

Update `buildPopup` to include a sort control:

```js
function buildPopup(location, articles) {
  const container = document.createElement('div');
  container.className = 'popup-container';

  let sortNewest = true;

  function render() {
    const sorted = [...articles].sort((a, b) =>
      sortNewest ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
    const typeLabels = {
      'viewpoint': 'Viewpoint',
      'from-the-word': 'From the Word',
      'witness': 'Witness',
      'world-report': 'World Report',
      'our-classics': 'Our Classics'
    };

    container.innerHTML = `
      <div class="popup-header">
        <strong>${location.name}</strong>
        <span>${sorted.length} article${sorted.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="popup-sort">
        <button class="sort-btn ${sortNewest ? 'active' : ''}" data-sort="newest">Newest</button>
        <button class="sort-btn ${!sortNewest ? 'active' : ''}" data-sort="oldest">Oldest</button>
      </div>
      <div class="popup-list">
        ${sorted.map(a => `
          <div class="popup-article">
            <div class="popup-article-title">${a.title}</div>
            <div class="popup-article-meta">
              ${a.author ? a.author + ' · ' : ''}${formatDate(a.date)} · <span class="type-badge type-${a.type}">${typeLabels[a.type] || a.type}</span>
            </div>
            <a href="${a.url}" target="_blank" rel="noopener" class="popup-article-link">Read article →</a>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sortNewest = btn.dataset.sort === 'newest';
        render();
      });
    });
  }

  render();
  return container;
}
```

**Step 2: Add sort button styles to css/style.css**

```css
.popup-sort {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.sort-btn {
  background: #f5f0eb;
  border: 1px solid #ddd;
  padding: 2px 10px;
  border-radius: 3px;
  font-size: 0.75rem;
  cursor: pointer;
  color: #6e7488;
}

.sort-btn.active {
  background: #3b3f51;
  color: #fff;
  border-color: #3b3f51;
}
```

**Step 3: Verify - click a pin with multiple articles**

Expected: Newest/Oldest toggle buttons. Clicking toggles sort order.

**Step 4: Commit**

```bash
git add js/map.js css/style.css
git commit -m "feat: sort toggle (newest/oldest) in popup panel"
```

---

### Task 7: Filter UI

**Files:**
- Modify: `js/filters.js`
- Modify: `js/app.js`

**Step 1: Build filter dropdowns in filters.js**

Replace filters.js content:

```js
// AFC GeoMap - Filters Module
const AFCFilters = (function () {
  'use strict';

  const TYPES = [
    { value: 'all', label: 'All Types' },
    { value: 'viewpoint', label: 'Viewpoint' },
    { value: 'from-the-word', label: 'From the Word' },
    { value: 'witness', label: 'Witness' },
    { value: 'world-report', label: 'World Report' },
    { value: 'our-classics', label: 'Our Classics' }
  ];

  const DECADES = [
    { value: 'all', label: 'All Decades' },
    { value: '1960s', label: '1960s-70s' },
    { value: '1980s', label: '1980s' },
    { value: '1990s', label: '1990s' },
    { value: '2000s', label: '2000s' },
    { value: '2010s', label: '2010s' },
    { value: '2020s', label: '2020s' }
  ];

  let allArticles = [];
  let allLocations = [];
  let mapInstance = null;

  function init(articles, locations, map) {
    allArticles = articles;
    allLocations = locations;
    mapInstance = map;

    const container = document.getElementById('filters');
    container.innerHTML = `
      <select id="filter-type" class="filter-select">${TYPES.map(t =>
        `<option value="${t.value}">${t.label}</option>`
      ).join('')}</select>
      <select id="filter-decade" class="filter-select">${DECADES.map(d =>
        `<option value="${d.value}">${d.label}</option>`
      ).join('')}</select>
    `;

    document.getElementById('filter-type').addEventListener('change', applyFilters);
    document.getElementById('filter-decade').addEventListener('change', applyFilters);
    updateStatus(articles, allLocations);
  }

  function applyFilters() {
    const type = document.getElementById('filter-type').value;
    const decade = document.getElementById('filter-decade').value;

    let filtered = allArticles;
    if (type !== 'all') filtered = filtered.filter(a => a.type === type);
    if (decade !== 'all') filtered = filtered.filter(a => a.decade === decade);

    AFCMap.loadPins(mapInstance, filtered, allLocations);
    updateStatus(filtered, allLocations);
  }

  function updateStatus(articles, locations) {
    const el = document.getElementById('status-text');
    const locIds = new Set(articles.flatMap(a => a.locations));
    el.textContent = `Showing ${articles.length} articles across ${locIds.size} locations`;
  }

  return { init };
})();
```

**Step 2: Add filter styles to css/style.css**

```css
.header-right {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #6e7488;
  background: #2e3243;
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
}

.filter-select:focus { outline: 1px solid #8890a8; }
```

**Step 3: Verify - change filter selections**

Expected: dropdowns in header. Selecting "Witness" shows only witness articles/pins. Selecting "2020s" keeps all (sample data is 2020s). Status bar updates.

**Step 4: Commit**

```bash
git add js/filters.js js/app.js css/style.css
git commit -m "feat: filter dropdowns for article type and decade"
```

---

### Task 8: AFC Branding

**Files:**
- Create: `assets/logo.png`
- Modify: `css/style.css`

**Step 1: Download AFC logo**

```bash
curl -o assets/logo.png "https://cdn.prod.website-files.com/60f82ad12067d1d904335cc9/60f82f570b7e63261d8ddb7b_5f7f5ce7a4ccd86f986d7491_AFCLogo_CMYK_reversed.png"
```

**Step 2: Polish CSS for AFC look**

Add/update in style.css:

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');

body {
  font-family: 'Open Sans', sans-serif;
  background: #f5f0eb;
}

#header {
  background: #3b3f51;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
  position: relative;
}

#status-bar {
  background: #f5f0eb;
  z-index: 1000;
  position: relative;
}
```

**Step 3: Verify - visual check**

Expected: AFC logo in header, warm color scheme, clean typography.

**Step 4: Commit**

```bash
git add assets/logo.png css/style.css
git commit -m "feat: AFC branding with logo and warm color scheme"
```

---

### Task 9: Crawling Workflow Documentation

**Files:**
- Create: `crawl/workflow.md`
- Create: `data/raw/.gitkeep`

**Step 1: Write crawl/workflow.md**

```markdown
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
```

**Step 2: Create data/raw/.gitkeep**

```bash
mkdir -p data/raw && touch data/raw/.gitkeep
```

**Step 3: Commit**

```bash
git add crawl/workflow.md data/raw/.gitkeep
git commit -m "docs: crawling workflow for batch article processing"
```

---

### Task 10: Final Wiring and Polish

**Files:**
- Modify: `js/app.js` (error handling)
- Modify: `index.html` (favicon, meta)

**Step 1: Add error handling to app.js**

```js
(async function () {
  'use strict';

  try {
    const [articlesResp, locationsResp] = await Promise.all([
      fetch('data/articles.json'),
      fetch('data/locations.json')
    ]);

    if (!articlesResp.ok || !locationsResp.ok) {
      throw new Error('Failed to load data files');
    }

    const articles = await articlesResp.json();
    const locations = await locationsResp.json();

    const map = AFCMap.init('map');
    AFCMap.loadPins(map, articles, locations);
    AFCFilters.init(articles, locations, map);
  } catch (err) {
    console.error('AFC GeoMap init error:', err);
    document.getElementById('status-text').textContent = 'Error loading data. Please try again.';
  }
})();
```

**Step 2: Add meta tags to index.html head**

```html
<meta name="description" content="Interactive world map of Apostolic Faith Church magazine articles" />
<link rel="icon" href="assets/logo.png" type="image/png" />
```

**Step 3: Verify - full end-to-end test**

1. Open index.html in browser
2. Map loads with CartoDB Voyager tiles
3. 5 pins visible (some may cluster when zoomed out)
4. Click pin → popup with articles, sort toggle works
5. Change type filter → pins update
6. Status bar shows correct counts
7. "Read article →" links open in new tab

**Step 4: Commit**

```bash
git add js/app.js index.html
git commit -m "feat: error handling, meta tags, and final wiring"
```

**Step 5: Push to GitHub**

```bash
git push origin main
```

---

## Summary

- **Tasks 1-3**: Scaffold, map, sample data (foundation)
- **Tasks 4-6**: Pins, popups, sorting (core interaction)
- **Task 7**: Filters (exploration UX)
- **Task 8**: Branding (AFC identity)
- **Task 9**: Crawling docs (data pipeline prep)
- **Task 10**: Polish and deploy

After all tasks: working prototype with sample data. Next phase: crawling real articles.
