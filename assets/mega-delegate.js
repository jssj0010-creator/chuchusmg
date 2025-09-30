// v8.25: Robust mega menu toggle via event delegation
(function(){
  function ready(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  function closest(el, sel){ while(el && el.nodeType===1){ if(el.matches(sel)) return el; el = el.parentElement; } return null; }
  ready(function(){
    document.addEventListener("click", function(e){
      var t = e.target;
      if(!t) return;
      // If clicking inside a summary or button with class megaBtn
      var btn = t.closest && t.closest(".megaBtn, summary.megaBtn, [data-mega='btn']");
      if(!btn) return;
      e.preventDefault();
      // Candidate panel: next sibling .megaPanel, or #megaPanel, or within same header
      var panel = btn.nextElementSibling && btn.nextElementSibling.classList && btn.nextElementSibling.classList.contains("megaPanel") ? btn.nextElementSibling : null;
      if(!panel) panel = document.getElementById("megaPanel");
      if(!panel) panel = (closest(btn, "header,.header") || document).querySelector(".megaPanel");
      if(!panel) return;
      var open = panel.classList.contains("is-open") || panel.classList.contains("open") || (panel.closest("details") && panel.closest("details").open);
      // Close all other panels
      document.querySelectorAll(".megaPanel.is-open, .megaPanel.open").forEach(function(p){ if(p!==panel){ p.classList.remove("is-open","open"); var d=p.closest('details'); if(d) d.open=false; } });
      // Toggle current
      if(panel.closest("details")){ panel.closest("details").open = !open; }
      panel.classList.toggle("is-open", !open);
      panel.classList.toggle("open", !open);
      btn.setAttribute("aria-expanded", !open ? "true" : "false");
    });
    // Click outside to close
    document.addEventListener("click", function(e){
      var any = document.querySelector(".megaPanel.is-open, .megaPanel.open, details.mega[open]");
      if(!any) return;
      var target = e.target;
      // If click came from button handler above, it already handled preventDefault & toggled
      var isBtn = target.closest && target.closest(".megaBtn, summary.megaBtn, [data-mega='btn']");
      var inPanel = target.closest && target.closest(".megaPanel, details.mega");
      if(isBtn || inPanel) return;
      document.querySelectorAll("details.mega").forEach(function(d){ d.open=false; });
      document.querySelectorAll(".megaPanel.is-open, .megaPanel.open").forEach(function(p){ p.classList.remove("is-open","open"); });
      document.querySelectorAll(".megaBtn[aria-expanded='true']").forEach(function(b){ b.setAttribute("aria-expanded","false"); });
    }, true);
    // ESC to close
    window.addEventListener("keydown", function(e){
      if(e.key==="Escape"){
        document.querySelectorAll("details.mega").forEach(function(d){ d.open=false; });
        document.querySelectorAll(".megaPanel.is-open, .megaPanel.open").forEach(function(p){ p.classList.remove("is-open","open"); });
        document.querySelectorAll(".megaBtn[aria-expanded='true']").forEach(function(b){ b.setAttribute("aria-expanded","false"); });
      }
    });
  });
})();
