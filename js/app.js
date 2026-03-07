// AFC GeoMap - Main Application
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
