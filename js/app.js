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
