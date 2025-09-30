
(function(){
  function toNumberKRW(txt){
    var m = (txt||"").replace(/[^\d]/g, "");
    return m ? parseInt(m, 10) : null;
  }
  function parsePageOffers(){
    var offers = [];
    // Find tables with prices
    var rows = document.querySelectorAll("tr, .price-row");
    rows.forEach(function(row){
      // name in first cell (or data-course)
      var name = null;
      var firstCell = row.querySelector("td, th");
      if(firstCell){ name = (firstCell.textContent||"").trim(); }
      var cells = row.querySelectorAll("td, th");
      cells.forEach(function(cell){
        var label = cell.getAttribute("data-label") || cell.getAttribute("aria-label") || "";
        var txt = (cell.textContent||"").trim();
        var mDur = label.match(/(\d{2,3})\s*분/) || txt.match(/(\d{2,3})\s*분/);
        var mPrice = txt.match(/([\d,]+)\s*원/);
        if(mDur && mPrice){
          var duration = parseInt(mDur[1], 10);
          var price = toNumberKRW(mPrice[1]);
          if(price){
            offers.push({
              "@type": "Offer",
              "priceCurrency": "KRW",
              "price": price,
              "itemOffered": {
                "@type": "Service",
                "name": name || ("코스 "+duration+"분"),
                "serviceType": "출장마사지",
                "areaServed": "KR",
                "duration": "PT"+duration+"M"
              },
              "availability": "https://schema.org/InStock"
            });
          }
        }
      });
    });
    return offers;
  }
  function injectJSONLD(data){
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
  function run(){
    try{
      var offers = parsePageOffers();
      if(offers && offers.length){
        injectJSONLD({
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          "name": "츄츄마사지 가격표",
          "itemListElement": offers.slice(0, 30)
        });
      }
    }catch(e){ /* noop */ }
  }
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", run);
  }else{
    run();
  }
})();
