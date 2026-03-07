// AFC GeoMap - Map Module
const AFCMap = (function () {
  'use strict';

  let clusterGroup = null;

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

    clusterGroup = L.layerGroup();

    Object.values(pinData).forEach(({ location, articles }) => {
      const marker = L.marker([location.lat, location.lng]);
      marker.bindPopup(() => buildPopup(location, articles), { maxWidth: 320, maxHeight: 350 });
      marker.bindTooltip(`${location.name} (${articles.length})`, { direction: 'top', offset: [0, -10] });
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
  }

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
              ${a.authorPhoto ? `<img src="${a.authorPhoto}" alt="${a.author}" class="popup-author-photo" />` : ''}
              <div class="popup-article-body">
                <div class="popup-article-title">${a.title}</div>
                <div class="popup-article-meta">
                  ${a.author ? a.author + ' &middot; ' : ''}${formatDate(a.date)} &middot; <span class="type-badge type-${a.type}">${typeLabels[a.type] || a.type}</span>
                </div>
                <a href="${a.url}" target="_blank" rel="noopener" class="popup-article-link">Read article &rarr;</a>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          sortNewest = btn.dataset.sort === 'newest';
          render();
        });
      });
    }

    render();
    return container;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  return { init, loadPins };
})();
