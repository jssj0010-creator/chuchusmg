/* /assets/region-map.js */
(function () {
  const MAP_ID = "region-map";
  const KAKAO_OPENCHAT = "https://open.kakao.com/o/swv2PsUh";

  // 1) Leaflet CSS/JS 없으면 주입
  function ensureLeaflet(cb) {
    const hasL = !!window.L;
    const hasCss = !!document.querySelector('link[data-leaflet-css]');

    function loadScript(src, onload, onerror) {
      const s = document.createElement("script");
      s.src = src; s.async = true; s.defer = true; s.setAttribute("data-leaflet-js", "1");
      s.onload = onload; s.onerror = onerror || (()=>{});
      document.head.appendChild(s);
    }
    function loadCss(href) {
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = href; l.setAttribute("data-leaflet-css", "1");
      document.head.appendChild(l);
    }

    if (!hasCss) {
      loadCss("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    }
    if (hasL) return cb();

    // JS는 1차 unpkg, 실패 시 cdnjs로 한 번 더
    loadScript(
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
      cb,
      () => loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js", cb)
    );
  }

  // 2) 좌표 얻기: data-* → __REGION_COORDS__ → 슬러그 계열 → 기본값
  function getLatLng() {
    let fallback = [37.5665, 126.9780]; // 서울 시청 근처
    const el = document.getElementById(MAP_ID);
    if (!el) return fallback;

    const lat = parseFloat(el.getAttribute("data-lat"));
    const lng = parseFloat(el.getAttribute("data-lng"));
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];

    // __REGION_COORDS__ 사용 (이미 갖고 계신 테이블)
    const match = location.pathname.match(/\/regions\/([^\/]+)\.html$/);
    const key = match ? decodeURIComponent(match[1]) : null;
    const table = (window.__REGION_COORDS__ || {});
    if (key && table[key]) return table[key];

    // 대분류 키(seoul / incheon / gyeonggi)도 한 번 더 시도
    if (key) {
      const prefix = key.split("-")[0];
      if (table[prefix]) return table[prefix];
      // 흔한 기본값들(중심부)
      if (prefix === "seoul")   return [37.5665, 126.9780];
      if (prefix === "incheon") return [37.4563, 126.7052];
      if (prefix === "gyeonggi")return [37.4138, 127.5183];
    }
    return fallback;
  }

  // 3) 맵 초기화
  function init() {
    const el = document.getElementById(MAP_ID);
    if (!el) return;

    const center = getLatLng();
    const map = L.map(MAP_ID, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
    }).setView(center, 12);

    const layer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { maxZoom: 19 }
    ).addTo(map);

    // 타일 오류 시 예비 안내(네트워크/차단 등)
    layer.on("tileerror", () => {
      console.warn("타일 로딩 오류. 네트워크나 타일 서버 차단을 확인하세요.");
    });

    L.marker(center).addTo(map);
    // 초기·리사이즈 보정
    setTimeout(()=> map.invalidateSize(true), 120);
    window.addEventListener("resize", () => map.invalidateSize());
  }

  function start() { ensureLeaflet(init); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
