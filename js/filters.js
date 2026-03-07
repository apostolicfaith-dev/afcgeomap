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
