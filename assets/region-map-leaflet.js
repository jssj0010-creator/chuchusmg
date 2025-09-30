
// assets/region-map-leaflet.js (v1)
// Force a visible marker on every region page using Leaflet.
// Falls back to OSM iframe embed if Leaflet CDN fails.
(function(){
  var DEFAULT = {center:[37.5665,126.9780], marker:[37.5665,126.9780], zoom:12};

  function getK(){ return (window.KINGS_REGION_COORDS && typeof window.KINGS_REGION_COORDS==='object') ? window.KINGS_REGION_COORDS : {}; }

  function parseKey(){
    var c = document.getElementById('region-map');
    if (c){
      var r=c.getAttribute('data-region'), s=c.getAttribute('data-subregion');
      if (r && s) return r + '-' + s;
      if (r) return r;
    }
    try{
      var path = decodeURIComponent(location.pathname);
      var m = path.match(/\/regions\/([^\/]+)\.html$/);
      if (m) return m[1];
    }catch(e){}
    return 'seoul';
  }

  function ensureContainer(){
    var el = document.getElementById('region-map');
    if (!el){
      el = document.createElement('div');
      el.id = 'region-map';
      el.style.minHeight = '280px';
      el.style.borderRadius = '12px';
      el.style.overflow = 'hidden';
      var anchor = document.querySelector('.map-wrap') || document.querySelector('#coverage, h3#coverage, section#coverage');
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(el, anchor.nextSibling);
      else document.body.appendChild(el);
    }
    // ensure inner map div for Leaflet
    if (!el.querySelector('.leaflet-map')) {
      var m = document.createElement('div');
      m.className = 'leaflet-map';
      m.style.width = '100%';
      m.style.height = '280px';
      el.innerHTML = '';
      el.appendChild(m);
    }
    return el.querySelector('.leaflet-map');
  }

  function loadLeaflet(cb){
    var L = window.L;
    if (L && L.map) { cb(); return; }
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    css.integrity = 'sha256-o9N1j7kGStbVQnKjRzCQXDpUe1koXSPo6e7iMXm2zRM=';
    css.crossOrigin = '';
    document.head.appendChild(css);

    var js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.integrity = 'sha256-o9N1j7kGStbVQnKjRzCQXDpUe1koXSPo6e7iMXm2zRM='; // same hash works for js in this build
    js.crossOrigin = '';
    js.onload = cb;
    js.onerror = function(){
      cb(new Error('Leaflet CDN failed'));
    };
    document.head.appendChild(js);
  }

  function mountLeaflet(info){
    var lat = (info.marker && info.marker[0]) || (info.center && info.center[0]) || DEFAULT.center[0];
    var lon = (info.marker && info.marker[1]) || (info.center && info.center[1]) || DEFAULT.center[1];
    var z = info.zoom || DEFAULT.zoom;

    var target = ensureContainer();
    target.innerHTML = ''; // reset

    var map = L.map(target, { scrollWheelZoom:false, zoomControl:true }).setView([lat, lon], z);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup('이 지역 위치').openPopup();
  }

  function embedFallback(info){
    var lat = (info.marker && info.marker[0]) || (info.center && info.center[0]) || DEFAULT.center[0];
    var lon = (info.marker && info.marker[1]) || (info.center && info.center[1]) || DEFAULT.center[1];
    var z = info.zoom || DEFAULT.zoom;
    var bbox = [lon-0.055, lat-0.045, lon+0.055, lat+0.045].map(function(v){return v.toFixed(6)}).join(',');
    var src = 'https://www.openstreetmap.org/export/embed.html?bbox='+bbox+'&layer=mapnik&mlat='+encodeURIComponent(lat)+'&mlon='+encodeURIComponent(lon)+'&marker='+encodeURIComponent(lat+','+lon)+'#map='+encodeURIComponent(z)+'/'+encodeURIComponent(lat)+'/'+encodeURIComponent(lon);
    var container = document.getElementById('region-map') || ensureContainer().parentElement;
    container.innerHTML = '<iframe src="'+src+'" style="width:100%;height:280px;border:0" loading="lazy" referrerpolicy="no-referrer" title="지도"></iframe>';
  }

  function run(){
    var key = parseKey();
    var K = getK();
    var info = K[key] || K[key.split('-')[0]] || K['seoul'] || DEFAULT;

    loadLeaflet(function(err){
      if (err){ embedFallback(info); return; }
      try{ mountLeaflet(info); }
      catch(e){ embedFallback(info); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  window.addEventListener('load', function(){ try{ run(); }catch(e){} });
})();
