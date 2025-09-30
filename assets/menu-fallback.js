// v8.24: details/summary open fallback + z-fix guard
(function(){
  function ready(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  ready(function(){
    var d = document.querySelector("details.mega");
    var s = d && d.querySelector("summary.megaBtn");
    if(!d || !s) return;
    // Force toggle if click is swallowed by something else
    s.addEventListener("click", function(ev){
      // If a native toggle didn't happen within this call stack, force it.
      // Use a microtask to observe 'open' change; otherwise set it ourselves.
      var opened = d.hasAttribute("open");
      setTimeout(function(){
        var still = d.hasAttribute("open") === opened;
        if(still){ d.open = !opened; }
      },0);
    }, true);
    // Close when clicking outside
    document.addEventListener("click", function(e){
      if(!d.contains(e.target)) d.open = false;
    });
    // ESC closes
    window.addEventListener("keydown", function(e){
      if(e.key === "Escape") d.open = false;
    });
  });
})();
