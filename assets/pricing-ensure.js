
(function(){
  function norm(t){ return (t||"").replace(/\s+/g," ").trim(); }
  function ensureRow(tbl){
    var tb = tbl.querySelector('tbody') || tbl;
    var exists = !!tbl.querySelector('td') && Array.prototype.some.call(tbl.querySelectorAll('td'), function(td){
      return norm(td.textContent).indexOf('한국인 스웨디시마사지') !== -1;
    });
    if(exists) return;

    var headText = norm(tbl.textContent);
    if(headText.indexOf('60분') === -1 || headText.indexOf('90분') === -1) return;

    var tr = document.createElement('tr');
    tr.innerHTML = ('<td data-label="코스"><strong>한국인 스웨디시마사지</strong></td>' +'<td class="price" data-label="60분">140,000원</td>' +'<td class="price" data-label="90분">180,000원</td>' +'<td class="dim" data-label="120분">-</td>' +'<td class="dim" data-label="150분">-</td>');
    tb.appendChild(tr);
  }

  function enhance(){
    var tables = document.querySelectorAll('table');
    tables.forEach(function(tbl){
      ensureRow(tbl);

      var rows = tbl.querySelectorAll('tr');
      var koreanRow = null, specialRow = null;
      rows.forEach(function(tr){
        var first = tr.querySelector('td'); if(!first) return;
        var txt = norm(first.textContent);
        if(!koreanRow && txt.indexOf('한국인 스웨디시마사지') !== -1){ koreanRow = tr; }
        if(!specialRow && txt.indexOf('스페셜 감성 힐링마사지') !== -1){ specialRow = tr; }
      });

      if(koreanRow){
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
        for(var j=1;j<koreanRow.children.length && j<=2;j++){
          var cell = koreanRow.children[j];
          if(cell && !cell.querySelector('strong')){
            var s = document.createElement('strong');
            s.textContent = norm(cell.textContent);
            cell.textContent = ''; cell.appendChild(s);
          }
        }
        var badge = koreanRow.querySelector('.badge-reco'); if(badge) badge.remove();
      }
      if(specialRow){
        var firstCell = specialRow.querySelector('td');
        if(firstCell && !firstCell.querySelector('.badge-reco')){
          var badge2 = document.createElement('span'); badge2.className='badge-reco'; badge2.textContent='추천';
          firstCell.appendChild(document.createTextNode(' ')); firstCell.appendChild(badge2);
        }
      }
    });
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', enhance); }
  else { enhance(); }
})();

/* === v9.2 PRICE PATCH: 감성 힐링마사지 60분 → 90,000원 (sitewide) === */
;(function () {
  function plain(s){
    // 태그 제거 + 공백 제거
    return (s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,'');
  }

  function patchHealing60() {
    try {
      var tables = document.querySelectorAll('.pricing-table, table');
      var changed = 0;

      tables.forEach(function(tbl){
        var rows = tbl.querySelectorAll('tbody tr, tr');
        rows.forEach(function(tr){
          var first = tr.querySelector('td');
          if(!first) return;

          var name = plain(first.innerHTML || first.textContent);
          // 스페셜 제외 + 감성힐링마사지(띄어쓰기/태그 무시) 매칭
          if (name.indexOf('스페셜') !== -1) return;
          if (!(name.indexOf('감성') !== -1 && name.indexOf('힐링마사지') !== -1)) return;

          // 60분 셀: data-label="60분" 우선, 없으면 두 번째 <td>
          var cell60 = tr.querySelector('td[data-label="60분"], td[data-label="60 분"]') || tr.children[1];
          if(!cell60) return;

          var current = plain(cell60.innerHTML || cell60.textContent);
          if (current !== '90,000원' && current !== '90000원') {
            cell60.textContent = '90,000원';
            cell60.classList.add('price');
            changed++;
          }
        });
      });

      if (changed > 0 && window.console) {
        console.log('[pricing-ensure] 힐링 60분 가격 패치 적용:', changed, 'row(s)');
      }
    } catch (e) {
      // 표 없는 페이지 등은 조용히 패스
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchHealing60);
  } else {
    patchHealing60();
  }

  // 동적 삽입 대비해 한 번 더 감시
  try {
    var mo = new MutationObserver(function(){ patchHealing60(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})();
