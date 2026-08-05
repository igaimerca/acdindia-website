// ACD — shared site behaviour (no dependencies, no build step)
(function(){
  "use strict";

  /* Mobile nav toggle */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks){
    hamburger.addEventListener('click', function(){
      var open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* Reveal-on-scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* Animated counters */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1400;
        var start = null;
        function step(ts){
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = Math.floor(eased * target);
          el.textContent = value.toLocaleString('en-IN') + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString('en-IN') + suffix;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function(el){ cio.observe(el); });
  }

  /* Back to top */
  var backToTop = document.getElementById('backToTop');
  if (backToTop){
    window.addEventListener('scroll', function(){
      backToTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Copy-to-clipboard for donation details */
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var text = btn.getAttribute('data-copy');
      navigator.clipboard && navigator.clipboard.writeText(text).then(function(){
        var original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function(){ btn.textContent = original; }, 1600);
      });
    });
  });

  /* Gallery filter (stories/gallery pages) */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var filterItems = document.querySelectorAll('[data-category]');
  if (filterBtns.length && filterItems.length){
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        filterItems.forEach(function(item){
          var show = cat === 'all' || item.getAttribute('data-category') === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* Active nav link highlight */
  var here = window.location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.nav-links a[href]').forEach(function(a){
    var href = a.getAttribute('href');
    if (!href || href === '#') return;
    var resolved = new URL(href, window.location.href).pathname.replace(/index\.html$/, '');
    if (resolved === here) a.classList.add('active');
  });

})();
