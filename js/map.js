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
