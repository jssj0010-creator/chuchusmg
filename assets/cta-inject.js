(function(){
  function mount(){
    if (document.getElementById("sticky-cta")) return;

    var bar = document.createElement("div");
    bar.id = "sticky-cta";
    bar.innerHTML =
      '<a class="tel" href="tel:010-8346-1193" aria-label="전화 상담 연결">전화 상담</a>' +
      '<a class="home" href="/" aria-label="메인 페이지로 이동">홈</a>' +
      '<a class="kakao" href="https://open.kakao.com/o/swv2PsUh" target="_blank" rel="noopener" aria-label="카카오톡 오픈채팅으로 연결">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" style="vertical-align:-3px;margin-right:6px">' +
          '<path d="M12 3C6.48 3 2 6.69 2 11c0 2.54 1.66 4.82 4.2 6.29L5 22l4.35-2.39c.84.16 1.72.24 2.65.24 5.52 0 10-3.69 10-8.16C22 6.69 17.52 3 12 3z" fill="currentColor"/>' +
        '</svg><span>오픈채팅</span></a>';

    document.body.appendChild(bar);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
