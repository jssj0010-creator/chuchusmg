
(function() {
  const regions = [{"file": "gyeonggi-고양.html", "label": "고양"}, {"file": "gyeonggi-과천.html", "label": "과천"}, {"file": "gyeonggi-광명.html", "label": "광명"}, {"file": "gyeonggi-광주.html", "label": "광주"}, {"file": "gyeonggi-구리.html", "label": "구리"}, {"file": "gyeonggi-군포.html", "label": "군포"}, {"file": "gyeonggi-김포.html", "label": "김포"}, {"file": "gyeonggi-남양주.html", "label": "남양주"}, {"file": "gyeonggi-부천.html", "label": "부천"}, {"file": "gyeonggi-분당.html", "label": "분당"}, {"file": "gyeonggi-성남.html", "label": "성남"}, {"file": "gyeonggi-수원.html", "label": "수원"}, {"file": "gyeonggi-시흥.html", "label": "시흥"}, {"file": "gyeonggi-안산.html", "label": "안산"}, {"file": "gyeonggi-안양.html", "label": "안양"}, {"file": "gyeonggi-오산.html", "label": "오산"}, {"file": "gyeonggi-용인.html", "label": "용인"}, {"file": "gyeonggi-의정부.html", "label": "의정부"}, {"file": "gyeonggi-일산.html", "label": "일산"}, {"file": "gyeonggi-파주.html", "label": "파주"}, {"file": "gyeonggi-평택.html", "label": "평택"}, {"file": "gyeonggi-하남.html", "label": "하남"}, {"file": "gyeonggi.html", "label": "gyeonggi"}, {"file": "incheon-강화.html", "label": "강화"}, {"file": "incheon-계양.html", "label": "계양"}, {"file": "incheon-남동.html", "label": "남동"}, {"file": "incheon-동구.html", "label": "동구"}, {"file": "incheon-미추홀.html", "label": "미추홀"}, {"file": "incheon-부평.html", "label": "부평"}, {"file": "incheon-서구.html", "label": "서구"}, {"file": "incheon-송도.html", "label": "송도"}, {"file": "incheon-연수.html", "label": "연수"}, {"file": "incheon-영종도.html", "label": "영종도"}, {"file": "incheon-인천.html", "label": "인천"}, {"file": "incheon-중구.html", "label": "중구"}, {"file": "incheon.html", "label": "incheon"}, {"file": "index.html", "label": "index"}, {"file": "seoul-강남.html", "label": "강남"}, {"file": "seoul-강동.html", "label": "강동"}, {"file": "seoul-강북.html", "label": "강북"}, {"file": "seoul-강서.html", "label": "강서"}, {"file": "seoul-관악.html", "label": "관악"}, {"file": "seoul-광진.html", "label": "광진"}, {"file": "seoul-구로.html", "label": "구로"}, {"file": "seoul-금천.html", "label": "금천"}, {"file": "seoul-노원.html", "label": "노원"}, {"file": "seoul-도봉.html", "label": "도봉"}, {"file": "seoul-동대문.html", "label": "동대문"}, {"file": "seoul-동작.html", "label": "동작"}, {"file": "seoul-마포.html", "label": "마포"}, {"file": "seoul-서초.html", "label": "서초"}, {"file": "seoul-성동.html", "label": "성동"}, {"file": "seoul-성북.html", "label": "성북"}, {"file": "seoul-송파.html", "label": "송파"}, {"file": "seoul-양천.html", "label": "양천"}, {"file": "seoul-영등포.html", "label": "영등포"}, {"file": "seoul-용산.html", "label": "용산"}, {"file": "seoul-은평.html", "label": "은평"}, {"file": "seoul-종로.html", "label": "종로"}, {"file": "seoul-중구.html", "label": "중구"}, {"file": "seoul-중랑.html", "label": "중랑"}, {"file": "seoul.html", "label": "seoul"}];
  function q(s, el){return (el||document).querySelector(s);}
  function qa(s, el){return (el||document).querySelectorAll(s);}

  // Build quick search results (shared component)
  function attachSearch(scope){ 
    const input = q('[data-quicksearch]', scope);
    const list = q('[data-quickresults]', scope);
    if(!input || !list) return;
    function render(items){ 
      list.innerHTML = items.slice(0, 12).map(r => 
        `<a class="quick-item" href="/regions/${r.file}">${r.label}</a>`).join('');
    }
    input.addEventListener('input', (e) => {
      const v = e.target.value.trim();
      if(v.length < 1) { list.innerHTML = ''; return; }
      const m = regions.filter(r => r.label.toLowerCase().includes(v.toLowerCase()));
      render(m);
    });
  }

  // Mega menu toggle
  function setupMega(el){ 
    const btn = q('[data-mega-trigger]', el);
    const panel = q('[data-mega-panel]', el);
    if(!btn || !panel) return;
    let open = false;
    function show(){ panel.setAttribute('data-open','1'); open = true; }
    function hide(){ panel.removeAttribute('data-open'); open = false; }
    btn.addEventListener('click', (e)=>{ e.preventDefault(); open?hide():show(); });
    btn.addEventListener('keydown', (e)=>{ if(e.key==='Escape') hide(); });
    document.addEventListener('click', (e)=>{ 
      if(!panel.contains(e.target) && !btn.contains(e.target)) hide();
    });
    attachSearch(panel);
  }

  qa('[data-mega-root]').forEach(setupMega);
})();
