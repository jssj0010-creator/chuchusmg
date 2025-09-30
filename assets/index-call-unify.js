\
// index-call-unify.js
(function(){
  var TEL_NUM = "010-8346-1193";
  var TEL_HREF = "tel:01083461193";

  function makeBtn(label, number){
    var a = document.createElement('a');
    a.className = 'btn-call';
    a.href = TEL_HREF;
    a.textContent = (label ? (label + " ") : "") + (number || TEL_NUM);
    return a;
  }

  function wrapHeroConsult(){
    // Find text like "상담: 010-8346-1193" in hero/lead paragraphs
    var re = /(상담)\s*[:：]\s*(010-\d{3,4}-\d{4})/;
    document.querySelectorAll('h1, h2, h3, p, .lead, .sub, .subtitle, .hero, .hero *').forEach(function(el){
      if (!el || !el.childNodes) return;
      for (var i=0; i<el.childNodes.length; i++){
        var n = el.childNodes[i];
        if (n.nodeType === Node.TEXT_NODE){
          var txt = n.nodeValue;
          var m = re.exec(txt);
          if (m){
            var before = txt.slice(0, m.index);
            var after  = txt.slice(m.index + m[0].length);
            var frag = document.createDocumentFragment();
            if (before) frag.appendChild(document.createTextNode(before));
            frag.appendChild(makeBtn(m[1], m[2]));
            if (after) frag.appendChild(document.createTextNode(after));
            el.replaceChild(frag, n);
            break;
          }
        }
      }
    });
  }

  function wrapListCall(){
    // Find "전화(010-8346-1193)" in lists
    var re = /(전화)\s*[\(（]\s*(010-\d{3,4}-\d{4})\s*[\)）]/;
    document.querySelectorAll('ol li, ul li, p').forEach(function(el){
      if (!el || !el.childNodes) return;
      for (var i=0; i<el.childNodes.length; i++){
        var n = el.childNodes[i];
        if (n.nodeType === Node.TEXT_NODE){
          var txt = n.nodeValue;
          var m = re.exec(txt);
          if (m){
            var before = txt.slice(0, m.index);
            var after  = txt.slice(m.index + m[0].length);
            var frag = document.createDocumentFragment();
            if (before) frag.appendChild(document.createTextNode(before));
            frag.appendChild(makeBtn(m[1], m[2]));
            if (after) frag.appendChild(document.createTextNode(after));
            el.replaceChild(frag, n);
            break;
          }
        }
      }
    });
  }

  function unifyAnchors(){
    // "전화 상담하기" or "전화 010-..." anchors -> .btn-call + tel href
    document.querySelectorAll('a').forEach(function(a){
      var text = (a.textContent || '').replace(/\s+/g,' ').trim();
      if (/^전화\s*상담하기$/.test(text) || /^전화\s*\d{2,3}-?\d{3,4}-?\d{4}$/.test(text)){
        a.classList.add('btn-call');
        a.setAttribute('href', TEL_HREF);
      }
    });
  }

  function run(){
    wrapHeroConsult();
    wrapListCall();
    unifyAnchors();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
