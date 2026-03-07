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
    updateStatus(articles);
  }

  function applyFilters() {
    const type = document.getElementById('filter-type').value;
    const decade = document.getElementById('filter-decade').value;

    let filtered = allArticles;
    if (type !== 'all') filtered = filtered.filter(a => a.type === type);
    if (decade !== 'all') filtered = filtered.filter(a => a.decade === decade);

    AFCMap.loadPins(mapInstance, filtered, allLocations);
    updateStatus(filtered);
  }

  function updateStatus(articles) {
    const el = document.getElementById('status-text');
    const locIds = new Set(articles.flatMap(a => a.locations));
    el.textContent = `Showing ${articles.length} articles across ${locIds.size} locations`;
  }

  return { init };
})();
