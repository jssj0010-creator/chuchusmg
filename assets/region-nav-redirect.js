
/*! Region Nav Redirect v1.0 — KingsMSG
 *  Make '소개' and '코스표' in REGION pages go to main page
 */
(function(){
  // Only run on region pages
  if(!/\/regions\/[^\/]+\.html$/i.test(location.pathname)) return;

  // === SETTINGS ===
  var MAIN_URL = "/"; // e.g., "/" or "/#about" etc.
  var MAP = {
    "소개": "/",
    "코스표": "/"
    // 필요하면 "이용안내":"/" 식으로 추가 가능
  };

  function textOf(el){
    return (el.innerText || el.textContent || "").replace(/\s+/g," ").trim();
  }

  function forceHref(el, dest){
    if(el.tagName.toLowerCase()==="a"){
      el.setAttribute("href", dest);
    } else {
      el.setAttribute("role","link");
      el.style.cursor = "pointer";
      el.addEventListener("click", function(e){ e.preventDefault(); location.href = dest; });
    }
    // GA4 gtag이 있으면 이벤트 로깅(선택)
    if(window.gtag){
      el.addEventListener("click", function(){
        gtag('event','region_nav_redirect', {event_category:'navigation', event_label: dest});
      });
    }
  }

  function apply(){
    var candidates = Array.prototype.slice.call(document.querySelectorAll('a, button, [role="button"]'));
    candidates.forEach(function(el){
      var label = textOf(el);
      if(!label) return;
      // 정확 일치 또는 앞뒤 공백만 차이
      if(MAP[label] !== undefined){
        forceHref(el, MAP[label] || MAIN_URL);
        return;
      }
      // 부분 일치(예: "코스표 보기")
      if(/소개/.test(label)){
        forceHref(el, MAP["소개"] || MAIN_URL);
        return;
      }
      if(/코스표/.test(label)){
        forceHref(el, MAP["코스표"] || MAIN_URL);
        return;
      }
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", apply);
  } else { apply(); }
})();
