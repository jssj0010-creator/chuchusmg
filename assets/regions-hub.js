
(function(){
  // --- Data: region-wise subareas (extend anytime) ---
  var DATA = {
    seoul: {
      nameKo: "서울",
      slug: "seoul",
      title: "킹즈출장마사지 | 서울 출장마사지 · 24시 후불제",
      desc: "서울 전지역 출장/홈케어. 강남·서초·송파·마포·용산 등 주요 지역 즉시 배정, 후불제, 합리적 요금.",
      areas: ["강남","서초","송파","마포","용산","종로","성동","광진","동대문","성북","은평","노원","중랑","중구","강동","강서","양천","구로","금천","동작","영등포","관악","강북","도봉"]
    },
    gyeonggi: {
      nameKo: "경기",
      slug: "gyeonggi",
      title: "킹즈출장마사지 | 경기 출장마사지 · 24시 후불제",
      desc: "경기 전지역 출장/홈케어. 성남·분당·수원·용인·고양·일산·평택 등, 후불제/빠른 배정.",
      areas: ["성남","분당","수원","용인","고양","일산","부천","김포","의정부","평택","시흥","안산","안양","과천","광명","파주","하남","구리","남양주","군포","오산","광주"]
    },
    incheon: {
      nameKo: "인천",
      slug: "incheon",
      title: "킹즈출장마사지 | 인천 출장마사지 · 24시 후불제",
      desc: "인천 전지역 출장/홈케어. 송도·연수·미추홀·영종도·계양·부평 등, 합리적 요금/후불제.",
      areas: ["인천","계양","부평","미추홀","연수","송도","남동","서구","강화","영종도","중구","동구"]
    }
  };

  function q(sel, root){ return (root||document).querySelector(sel); }
  function el(tag, attrs){ var e=document.createElement(tag); if(attrs){ for(var k in attrs){ e.setAttribute(k, attrs[k]); } } return e; }
  function chip(href, label, title){ var a=el('a', {class:'chip', href:href, 'aria-label':label}); a.textContent = label; a.title = title||label; return a; }

  function render(regionKey){
    var info = DATA[regionKey]; if(!info){ console.warn("Unknown region:", regionKey); return; }

    // <head> SEO basics
    if(document.title) document.title = info.title;
    var metaDesc = q("meta[name='description']"); if(metaDesc) metaDesc.setAttribute("content", info.desc);
    var linkCanonical = q("link[rel='canonical']"); if(linkCanonical) linkCanonical.setAttribute("href", "https://kingsmsg.com/regions/"+info.slug+".html");
    // Open Graph
    var ogt = q("meta[property='og:title']"); if(ogt) ogt.setAttribute("content", info.title);
    var ogd = q("meta[property='og:description']"); if(ogd) ogd.setAttribute("content", info.desc);
    var ogu = q("meta[property='og:url']"); if(ogu) ogu.setAttribute("content", "https://kingsmsg.com/regions/"+info.slug+".html");

    // Root
    var root = q("#hub-root"); if(!root){ root = el('main', {id:'hub-root', class:'container'}); document.body.appendChild(root); }

    // H1
    var h1 = el('h1'); h1.textContent = "킹즈출장마사지 | "+info.nameKo+" 출장마사지 · 24시 후불제";
    root.appendChild(h1);

    // Intro
    var p = el('p'); p.className = 'kicker';
    p.textContent = info.desc + " 상담 010-8346-1193 · 카톡 오픈채팅 이용 가능.";
    root.appendChild(p);

    // Area chips
    var sec = el('section', {class:'region-quick', style:'margin:18px 0'});
    var h2 = el('h2'); h2.className = 'kicker'; h2.textContent = info.nameKo + " 주요 지역 바로가기";
    sec.appendChild(h2);
    var chips = el('div', {class:'chips'});
    info.areas.forEach(function(area){
      var href = "/regions/"+info.slug+"-"+area+".html";
      chips.appendChild(chip(href, area+" 출장마사지", area+" 출장마사지"));
    });
    sec.appendChild(chips);
    root.appendChild(sec);

    // Pricing CTA (anchors to home pricing)
    var cta = el('p');
    cta.innerHTML = "<a class='btn btn-ghost' href='/' aria-label='메인 코스표로 이동'>메인 코스표 보기</a>";
    root.appendChild(cta);

    // Breadcrumb structured data
    var ld = {
      "@context":"https://schema.org",
      "@type":"BreadcrumbList",
      "itemListElement":[
        {"@type":"ListItem","position":1,"name":"홈","item":"https://kingsmsg.com/"},
        {"@type":"ListItem","position":2,"name": info.nameKo+" 출장마사지","item":"https://kingsmsg.com/regions/"+info.slug+".html"}
      ]
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  // Expose global
  window.KingsMSGHub = { render: render };
})();
