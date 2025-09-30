
// assets/menu.js (v4)
// - Phone button label fixed to "전화상담" (keeps tel: link intact)
// - Black text for phone button
// - No wrapping inside buttons; compact mobile sizing
// - Mega menu auto-inject/toggle
(function(){
  function $(sel, root){ return (root||document).querySelector(sel); }
  function htmlToEl(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; }

  // --- Inject CSS (phone style + nowrap + compact) ---
  (function injectCSS(){
    var css = `
    /* Phone button visual */
    .header .actions a[href^="tel:"].btn-call{
      color:#111 !important;
      text-shadow:none !important;
      white-space:nowrap;
    }
    .header .actions .btn,
    .header .actions .megaBtn{ white-space:nowrap; }
    @media (max-width: 520px){
      .header .brand-text{ display:none; }
      .header .actions{ display:flex; flex-wrap:wrap; gap:8px; overflow:visible; }
      .header .actions .btn, .header .actions .megaBtn{ padding:8px 12px; font-size:14px; line-height:1.1; border-radius:12px; }
    }
    @media (max-width: 400px){
      .header .actions{ gap:6px; }
      .header .actions .btn, .header .actions .megaBtn{ padding:6px 10px; font-size:12.5px; border-radius:10px; }
    }`;
    var style = document.createElement('style');
    style.setAttribute('data-kings', 'header-compact-v4');
    style.textContent = css;
    document.head.appendChild(style);
  })();

  // --- Normalize phone button label to "전화상담" ---
  (function normalizePhoneButton(){
    var btn = document.querySelector('.header .actions a[href^="tel:"]');
    if(!btn) return;
    btn.textContent = "전화상담";
    btn.classList.add('btn-call');
    // keep existing href=tel:010... as-is for call
  })();

  // --- Mega panel auto-inject/toggle ---
  const PANEL_HTML = `
<aside class='panel' role='dialog' aria-label='지역출장 메뉴'>
  <div class='hd'><strong>지역출장</strong><button class='close' type='button'>닫기</button></div>
  <div class='body'>
    <h4>서울</h4>
    <div class='kw'><a href='/regions/seoul-강남.html'>강남출장마사지 | 강남출장안마 | 강남출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-서초.html'>서초출장마사지 | 서초출장안마 | 서초출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-송파.html'>송파출장마사지 | 송파출장안마 | 송파출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-마포.html'>마포출장마사지 | 마포출장안마 | 마포출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-용산.html'>용산출장마사지 | 용산출장안마 | 용산출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-종로.html'>종로출장마사지 | 종로출장안마 | 종로출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-성동.html'>성동출장마사지 | 성동출장안마 | 성동출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-광진.html'>광진출장마사지 | 광진출장안마 | 광진출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-동대문.html'>동대문출장마사지 | 동대문출장안마 | 동대문출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-성북.html'>성북출장마사지 | 성북출장안마 | 성북출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-은평.html'>은평출장마사지 | 은평출장안마 | 은평출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-노원.html'>노원출장마사지 | 노원출장안마 | 노원출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-중랑.html'>중랑출장마사지 | 중랑출장안마 | 중랑출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-중구.html'>중구출장마사지 | 중구출장안마 | 중구출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-강동.html'>강동출장마사지 | 강동출장안마 | 강동출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-강서.html'>강서출장마사지 | 강서출장안마 | 강서출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-양천.html'>양천출장마사지 | 양천출장안마 | 양천출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-구로.html'>구로출장마사지 | 구로출장안마 | 구로출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-금천.html'>금천출장마사지 | 금천출장안마 | 금천출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-동작.html'>동작출장마사지 | 동작출장안마 | 동작출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-영등포.html'>영등포출장마사지 | 영등포출장안마 | 영등포출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-관악.html'>관악출장마사지 | 관악출장안마 | 관악출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-강북.html'>강북출장마사지 | 강북출장안마 | 강북출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/seoul-도봉.html'>도봉출장마사지 | 도봉출장안마 | 도봉출장 | 호텔·전국 후불제 이용 가능</a></div>
    <h4>경기</h4>
    <div class='kw'><a href='/regions/gyeonggi-성남.html'>성남출장마사지 | 성남출장안마 | 성남출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-분당.html'>분당출장마사지 | 분당출장안마 | 분당출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-수원.html'>수원출장마사지 | 수원출장안마 | 수원출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-용인.html'>용인출장마사지 | 용인출장안마 | 용인출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-고양.html'>고양출장마사지 | 고양출장안마 | 고양출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-일산.html'>일산출장마사지 | 일산출장안마 | 일산출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-부천.html'>부천출장마사지 | 부천출장안마 | 부천출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-김포.html'>김포출장마사지 | 김포출장안마 | 김포출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-의정부.html'>의정부출장마사지 | 의정부찮ᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞᆞ'>의정부출장마사지 | 의정부출장안마 | 의정부출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-평택.html'>평택출장마사지 | 평택출장안마 | 평택출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-시흥.html'>시흥출장마사지 | 시흥출장안마 | 시흥출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-안산.html'>안산출장마사지 | 안산출장안마 | 안산출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-안양.html'>안양출장마사지 | 안양출장안마 | 안양출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-과천.html'>과천출장마사지 | 과천출장안마 | 과천출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-광명.html'>광명출장마사지 | 광명출장안마 | 광명출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-파주.html'>파주출장마사지 | 파주출장안마 | 파주출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-하남.html'>하남출장마사지 | 하남출장안마 | 하남출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-구리.html'>구리출장마사지 | 구리출장안마 | 구리출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-남양주.html'>남양주출장마사지 | 남양주출장안마 | 남양주출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-군포.html'>군포출장마사지 | 군포출장안마 | 군포출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-오산.html'>오산출장마사지 | 오산출장안마 | 오산출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/gyeonggi-광주.html'>광주출장마사지 | 광주출장안마 | 광주출장 | 호텔·전국 후불제 이용 가능</a></div>
    <h4>인천</h4>
    <div class='kw'><a href='/regions/incheon-인천.html'>인천출장마사지 | 인천출장안마 | 인천출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-계양.html'>계양출장마사지 | 계양출장안마 | 계양출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-부평.html'>부평출장마사지 | 부평출장안마 | 부평출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-미추홀.html'>미추홀출장마사지 | 미추홀출장안마 | 미추홀출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-연수.html'>연수출장마사지 | 연수출장안마 | 연수출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-송도.html'>송도출장마사지 | 송도출장안마 | 송도출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-남동.html'>남동출장마사지 | 남동출장안마 | 남동출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-서구.html'>서구출장마사지 | 서구＼(^)'>서구출장마사지 | 서구출장안마 | 서구출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-강화.html'>강화출장마사지 | 강화출장안마 | 강화출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-영종도.html'>영종도출장마사지 | 영종도출장안마 | 영종도출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-중구.html'>중구출장마사지 | 중구출장안마 | 중구출장 | 호텔·전국 후불제 이용 가능</a></div>
    <div class='kw'><a href='/regions/incheon-동구.html'>동구출장마사지 | 동구출장안마 | 동구출장 | 호텔·전국 후불제 이용 가능</a></div>
  </div>
</aside>`;

  function ensureOverlay(){
    var ov = $('.overlay');
    if (!ov) { ov = htmlToEl("<div class='overlay'></div>"); document.body.insertBefore(ov, document.body.firstChild); }
    return ov;
  }
  function ensurePanel(){
    var panel = document.querySelector('.panel');
    if (!panel) { panel = htmlToEl(PANEL_HTML); document.body.appendChild(panel); }
    return panel;
  }
  function wire(){
    var btn = document.querySelector('.megaBtn'); if(!btn) return;
    var overlay = ensureOverlay();
    var panel = ensurePanel();
    var closeBtn = panel.querySelector('.close');
    function open(){ panel.classList.add('open'); btn.setAttribute('aria-expanded','true'); overlay.classList.add('show'); document.body.classList.add('noscroll'); }
    function close(){ panel.classList.remove('open'); btn.setAttribute('aria-expanded','false'); overlay.classList.remove('show'); document.body.classList.remove('noscroll'); }
    btn.addEventListener('click', function(e){ e.preventDefault(); panel.classList.contains('open') ? close() : open(); });
    overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && panel.classList.contains('open')) close(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
