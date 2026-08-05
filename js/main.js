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

  /* Lightbox: next/prev, zoom, keyboard, swipe — used by any [data-lightbox] group */
  var lbGroups = {};
  document.querySelectorAll('[data-lightbox]').forEach(function(el, i){
    var group = el.getAttribute('data-lightbox') || 'default';
    if (!lbGroups[group]) lbGroups[group] = [];
    var index = lbGroups[group].length;
    lbGroups[group].push({
      src: el.getAttribute('href') || el.querySelector('img').src,
      caption: el.getAttribute('data-caption') || el.querySelector('img').alt || ''
    });
    el.setAttribute('data-lb-index', index);
    el.addEventListener('click', function(e){
      e.preventDefault();
      openLightbox(group, index);
    });
  });

  var lb, lbImg, lbCaption, lbCounter, currentGroup, currentIndex;
  function buildLightbox(){
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">✕</button>' +
      '<button class="lb-prev" aria-label="Previous">‹</button>' +
      '<button class="lb-next" aria-label="Next">›</button>' +
      '<div class="lb-stage"><img alt=""><div class="lb-caption"></div></div>' +
      '<div class="lb-counter"></div>' +
      '<div class="lb-hint">Click image to zoom · ← → to navigate · Esc to close</div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img');
    lbCaption = lb.querySelector('.lb-caption');
    lbCounter = lb.querySelector('.lb-counter');

    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-prev').addEventListener('click', function(){ step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function(){ step(1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) closeLightbox(); });
    lbImg.addEventListener('click', function(){ lbImg.classList.toggle('zoomed'); });

    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    /* basic swipe support */
    var touchStartX = null;
    lb.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function(e){
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
      touchStartX = null;
    }, { passive: true });
  }

  function openLightbox(group, index){
    if (!lb) buildLightbox();
    currentGroup = group;
    currentIndex = index;
    render();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function step(dir){
    var items = lbGroups[currentGroup];
    currentIndex = (currentIndex + dir + items.length) % items.length;
    render();
  }
  function render(){
    var items = lbGroups[currentGroup];
    var item = items[currentIndex];
    lbImg.classList.remove('zoomed');
    lbImg.src = item.src;
    lbImg.alt = item.caption;
    lbCaption.textContent = item.caption;
    lbCounter.textContent = (currentIndex + 1) + ' / ' + items.length;
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
