/* ROOM26 — main.js (vanilla, progressive enhancement) */
(function () {
  'use strict';
  window.__room26 = true; /* tells the inline head script that the enhancements are running */
  var html = document.documentElement;
  var noAnim = html.classList.contains('no-anim') || html.classList.contains('reduced');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var maniWords = []; /* filled below; referenced by onScroll() */

  /* ---------- header: solid after scroll + active section ---------- */
  var head = $('#site-head');
  var navLinks = $$('.nav a[href^="#"]');
  var sections = ['top', 'events', 'club', 'aziendali', 'movie-set', 'contact'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  function onScroll() {
    if (head) head.classList.toggle('scrolled', window.scrollY > 40);
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) { if (sections[i].offsetTop <= y) current = sections[i]; }
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + current.id); });
    updateManifesto();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var menuBtn = $('.menu-btn');
  var overlay = $('#menu-overlay');
  var lastFocus = null;
  var behind = [$('#content'), $('.site-foot'), $('.skip')].filter(Boolean); /* everything under the overlay */
  function setInert(on) {
    behind.forEach(function (el) {
      if ('inert' in el) el.inert = on;
      else if (on) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden');
    });
  }
  function menuFocusables() {
    return $$('a[href], button', head).concat($$('a[href], button', overlay)).filter(function (el) { return !el.hidden && el.getClientRects().length; });
  }
  function trapTab(e) {
    if (e.key !== 'Tab' || !overlay || overlay.hidden) return;
    var f = menuFocusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1], cur = document.activeElement, i = f.indexOf(cur);
    if (i === -1) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && cur === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus(); }
  }
  function openMenu() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    setInert(true);
    var first = $('a', overlay); if (first) first.focus();
  }
  function closeMenu() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    setInert(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (menuBtn && overlay) {
    menuBtn.addEventListener('click', function () { overlay.hidden ? openMenu() : closeMenu(); });
    $$('a', overlay).forEach(function (a) { a.addEventListener('click', function () { closeMenu(); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); else trapTab(e); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100) closeMenu(); });
  }

  /* ---------- tonight / next chip (Europe/Rome) ---------- */
  (function () {
    var chip = $('#tonight-chip'), label = $('#tonight-label');
    var day;
    try {
      var fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Rome', weekday: 'short', hour: 'numeric', hour12: false });
      var parts = fmt.formatToParts(new Date());
      var wd = parts.filter(function (p) { return p.type === 'weekday'; })[0].value;
      var hour = parseInt(parts.filter(function (p) { return p.type === 'hour'; })[0].value, 10) % 24;
      day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd);
      if (hour < 6) day = (day + 6) % 7; /* until 6am it is still "tonight" of the previous day */
    } catch (e) { day = new Date().getDay(); }
    var names = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    var club = [4, 5, 6, 0];
    var tonight = club.indexOf(day) > -1;
    var target = day;
    if (!tonight) { for (var i = 1; i <= 7; i++) { if (club.indexOf((day + i) % 7) > -1) { target = (day + i) % 7; break; } } }
    if (chip && label) { label.textContent = (tonight ? 'Tonight' : 'Next') + ' · ' + names[target]; chip.hidden = false; }
    var card = $('.res[data-day="' + target + '"]');
    if (card) {
      card.classList.add('today');
      var c = $('.res-chip', card); if (c) { c.hidden = false; $('span', c).textContent = tonight ? 'Tonight' : 'Next'; }
    }
  })();

  /* ---------- reveal on scroll ---------- */
  var reveals = $$('.reveal');
  var tcards = $$('.tcard');
  if (noAnim || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    tcards.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    tcards.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up readouts ---------- */
  var counters = $$('[data-count]');
  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    var start = null, dur = 1100;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e);
      if (p < 1) requestAnimationFrame(step); else el.textContent = end;
    }
    requestAnimationFrame(step);
  }
  if (!noAnim && 'IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- 26-segment meter ---------- */
  var meter = $('#meter');
  if (meter) {
    $$('i', meter).forEach(function (seg, i) { seg.style.setProperty('--i', i); });
    if (noAnim || !('IntersectionObserver' in window)) { meter.classList.add('lit'); }
    else {
      var mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { meter.classList.add('lit'); mio.unobserve(meter); } });
      }, { threshold: 0.5 });
      mio.observe(meter);
    }
  }

  /* ---------- manifesto: word-by-word brighten on scroll ---------- */
  $$('.mani').forEach(function (p) {
    var text = p.textContent;
    p.textContent = '';
    text.split(' ').forEach(function (w, i, arr) {
      var s = document.createElement('span'); s.className = 'w'; s.textContent = w; p.appendChild(s);
      if (i < arr.length - 1) p.appendChild(document.createTextNode(' '));
      maniWords.push(s);
    });
  });
  function updateManifesto() {
    if (noAnim || !maniWords.length) return;
    var vh = window.innerHeight;
    for (var i = 0; i < maniWords.length; i++) {
      var r = maniWords[i].getBoundingClientRect();
      var on = r.top < vh * 0.72;
      if (on !== maniWords[i].classList.contains('on')) maniWords[i].classList.toggle('on', on);
    }
  }
  if (noAnim) maniWords.forEach(function (w) { w.classList.add('on'); });
  updateManifesto();

  /* ---------- continuous animations: pause while off-screen (battery) ---------- */
  var loops = $$('.hero-media, .ticker, .names, .brands');
  if ('IntersectionObserver' in window && loops.length) {
    var lio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-off', !en.isIntersecting); });
    }, { rootMargin: '160px 0px' });
    loops.forEach(function (el) { lio.observe(el); });
  }

  /* ---------- residencies: the <=640px snap scroller has no focusable child -> focus the scroller ---------- */
  var resRow = $('.res-row');
  if (resRow && window.matchMedia) {
    var rowMq = window.matchMedia('(max-width: 640px)');
    var setRowTab = function () { if (rowMq.matches) resRow.setAttribute('tabindex', '0'); else resRow.removeAttribute('tabindex'); };
    if (rowMq.addEventListener) rowMq.addEventListener('change', setRowTab); else if (rowMq.addListener) rowMq.addListener(setRowTab);
    setRowTab();
  }

  /* ---------- horizontal strips: prev/next + counter ---------- */
  function stripBy(name) { return document.getElementById(name); }
  $$('[data-strip-prev]').forEach(function (b) {
    b.addEventListener('click', function () { var s = stripBy(b.getAttribute('data-strip-prev')); if (s) s.scrollBy({ left: -s.clientWidth * 0.8, behavior: noAnim ? 'auto' : 'smooth' }); });
  });
  $$('[data-strip-next]').forEach(function (b) {
    b.addEventListener('click', function () { var s = stripBy(b.getAttribute('data-strip-next')); if (s) s.scrollBy({ left: s.clientWidth * 0.8, behavior: noAnim ? 'auto' : 'smooth' }); });
  });
  var gal = $('#gallery'), galCount = $('#gal-count');
  if (gal && galCount) {
    var items = $$('li', gal);
    var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var upd = function () {
      var base = gal.getBoundingClientRect().left + gal.clientLeft, idx = 0;
      for (var i = 0; i < items.length; i++) { if (items[i].getBoundingClientRect().left - base <= 8) idx = i; }
      galCount.textContent = pad2(idx + 1) + ' / ' + pad2(items.length);
    };
    gal.addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), lbCount = $('#lb-count');
  if (lb && lbImg && typeof lb.showModal === 'function') {
    var set = [], idx = 0, opener = null;
    function show(i) {
      idx = (i + set.length) % set.length;
      var a = set[idx];
      lbImg.src = a.getAttribute('href');
      var im = $('img', a);
      lbImg.alt = im ? im.alt : '';
      lbCap.textContent = a.getAttribute('data-caption') || '';
      lbCount.textContent = (idx + 1) + ' / ' + set.length;
      var nx = set[(idx + 1) % set.length]; if (nx) { var pre = new Image(); pre.src = nx.getAttribute('href'); }
    }
    $$('[data-lightbox]').forEach(function (list) {
      var links = $$('a[href]', list);
      links.forEach(function (a, i) {
        a.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; /* let modifier clicks open the file */
          e.preventDefault();
          set = links; opener = a; show(i);
          lb.showModal();
          document.body.classList.add('menu-open');
        });
      });
    });
    function close() { lb.close(); }
    lb.addEventListener('close', function () { document.body.classList.remove('menu-open'); lbImg.removeAttribute('src'); if (opener) opener.focus(); });
    $('[data-lb-close]', lb).addEventListener('click', close);
    $('[data-lb-prev]', lb).addEventListener('click', function () { show(idx - 1); });
    $('[data-lb-next]', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { show(idx + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { show(idx - 1); e.preventDefault(); }
      if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    var tx = null;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); tx = null; });
  }

  /* ---------- footer year ---------- */
  var yr = $('#year'); if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---------- in-page anchors: close menu, keep hash tidy ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('href').slice(1);
      if (id && document.getElementById(id)) closeMenu();
    });
  });
})();
