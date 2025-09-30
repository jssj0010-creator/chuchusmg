
(function(){
  function norm(t){ return (t||"").replace(/\s+/g," ").trim(); }

  function enhance(){
    var tables = document.querySelectorAll('table');
    tables.forEach(function(tbl){
      var rows = tbl.querySelectorAll('tr');
      var koreanRow = null, specialRow = null;

      rows.forEach(function(tr){
        var first = tr.querySelector('td');
        if(!first) return;
        var txt = norm(first.textContent);
        if(!koreanRow && txt.indexOf('한국인 스웨디시마사지') !== -1){
          koreanRow = tr;
        }
        if(!specialRow && txt.indexOf('스페셜 감성 힐링마사지') !== -1){
          specialRow = tr;
        }
      });

      // 1) 한국인 스웨디시마사지: separator + subtle highlight + bold 60/90, NO badge
      if(koreanRow){
        // add separator above if not present
        var prev = koreanRow.previousElementSibling;
        if(!(prev && prev.classList && prev.classList.contains('pricing-sep'))){
          var sep = document.createElement('tr');
          sep.className = 'pricing-sep';
          var col = document.createElement('td');
          col.setAttribute('colspan', (koreanRow.children.length || 5));
          sep.appendChild(col);
          koreanRow.parentNode.insertBefore(sep, koreanRow);
        }
        koreanRow.classList.add('pricing-reco');
        // bold 60/90 columns if not strong
        for(var j=1;j<koreanRow.children.length && j<=2;j++){
          var cell = koreanRow.children[j];
          if(cell && !cell.querySelector('strong')){
            var s = document.createElement('strong');
            s.textContent = norm(cell.textContent);
            cell.textContent = '';
            cell.appendChild(s);
          }
        }
        // ensure there is NO badge inside first cell
        var badge = koreanRow.querySelector('.badge-reco');
        if(badge) badge.remove();
      }

      // 2) 스페셜 감성 힐링마사지: add small green "추천" badge in first cell (ONLY badge, no highlight/separator)
      if(specialRow){
        var firstCell = specialRow.querySelector('td');
        if(firstCell && !firstCell.querySelector('.badge-reco')){
          var badge2 = document.createElement('span');
          badge2.className = 'badge-reco';
          badge2.textContent = '추천';
          firstCell.appendChild(document.createTextNode(' '));
          firstCell.appendChild(badge2);
        }
      }
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', enhance);
  } else { enhance(); }
})();
