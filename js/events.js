/* ROOM26 — events.js
   Live events from the club's WordPress REST API (CORS is open on room26.it).
   Shows "Upcoming" (start_date >= tonight's cutoff, ascending) or, if no future night is published yet,
   the most recent nights under "Latest". The block ships with a skeleton of the same height so the page
   never shifts when the cards arrive; on error the block hides itself and the weekly residencies stay visible.
   Fetches the newest 100 published events with nested _fields (~100 KB raw / ~9 KB gzip) so far-ahead
   nights (NYE, headliners) are not pushed out of the window by later posts. */
(function () {
  'use strict';
  var API = 'https://www.room26.it/wp-json/wp/v2/events?per_page=100&_fields=id,title,link,acf.start_date,acf.sold_out,acf.address_location,acf.cover_square_url.url,acf.cover_square_url.sizes.large,acf.cover_vertical_url.url,acf.cover_vertical_url.sizes.large,acf.cover_horizontal_url.url,acf.cover_horizontal_url.sizes.large';
  var box = document.getElementById('live');
  var grid = document.getElementById('live-grid');
  var title = document.getElementById('live-title');
  var count = document.getElementById('live-count');
  var empty = document.getElementById('live-empty');
  if (!box || !grid || !title || !count) return;
  if (!('fetch' in window)) { box.hidden = true; return; }

  var DAYS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  var MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  var PLACE = 'Piazza Guglielmo Marconi, 31 Roma';
  var COVERS = ['cover_square_url', 'cover_vertical_url', 'cover_horizontal_url'];
  var SITE = /^https:\/\/www\.room26\.it\//;

  /* a visitor who already started scrolling must not be yanked when the cards land */
  var userScrolled = false;
  function markScrolled() { userScrolled = true; }
  ['wheel', 'touchstart', 'keydown'].forEach(function (t) { window.addEventListener(t, markScrolled, { passive: true, once: true }); });

  /* "21/05/2026 23:00:00" (Rome wall-clock) -> Date built from the same wall-clock numbers */
  function parseDate(s) {
    if (!s) return null;
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(String(s).trim());
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], m[4] ? +m[4] : 23, m[5] ? +m[5] : 0, 0, 0);
  }
  /* "now" as Rome wall-clock, so the comparison does not drift with the visitor's timezone */
  function romeNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var g = {}; parts.forEach(function (p) { g[p.type] = p.value; });
      var d = new Date(+g.year, +g.month - 1, +g.day, (+g.hour) % 24, +g.minute, 0, 0);
      if (!isNaN(d.getTime())) return d;
    } catch (e) { /* fall through */ }
    return new Date();
  }
  /* a night counts until 06:00 of the following morning: cutoff = 06:00 of the "club day" we are in */
  function cutoffDate() {
    var base = new Date(romeNow().getTime() - 6 * 3600e3);
    return new Date(base.getFullYear(), base.getMonth(), base.getDate(), 6, 0, 0, 0);
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /* old listing format: "Gio 21 Mag 2026 | Start @ 23:00" */
  function fmtDate(d) { return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ' | Start @ ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function decode(s) { var t = document.createElement('textarea'); t.innerHTML = String(s || '').replace(/<[^>]*>/g, ''); return t.value.replace(/<[^>]*>/g, ''); }
  function cover(acf) {
    if (!acf) return '';
    for (var i = 0; i < COVERS.length; i++) {
      var c = acf[COVERS[i]];
      if (!c || typeof c !== 'object') continue;
      var url = (c.sizes && (c.sizes.large || c.sizes.medium_large)) || c.url || '';
      if (SITE.test(url)) return url;
    }
    return '';
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function card(ev, past) {
    var a = el('a', 'ev' + (past ? ' past' : ''));
    a.href = SITE.test(ev.link || '') ? ev.link : 'https://www.room26.it/events/';
    a.target = '_blank'; a.rel = 'noopener';
    var media = el('div', 'ev-media');
    var src = cover(ev.acf);
    if (src) { var img = el('img'); img.src = src; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.width = 819; img.height = 1024; media.appendChild(img); }
    a.appendChild(media);
    if (!past && ev.acf && ev.acf.sold_out) a.appendChild(el('span', 'ev-tape', 'Sold out'));
    var body = el('div', 'ev-body');
    body.appendChild(el('p', 'ev-date mono', ev._date ? fmtDate(ev._date) : ''));
    body.appendChild(el('h4', 'ev-title', decode(ev.title && ev.title.rendered)));
    body.appendChild(el('p', 'ev-place', (ev.acf && ev.acf.address_location) || PLACE));
    a.appendChild(body);
    return a;
  }

  /* deep links (#club, #aziendali, #movie-set, #contact, legacy #!/...) were resolved before the cards
     existed: if the block changed height, re-align the target unless the visitor already scrolled */
  function reanchor() {
    var m = /^#([\w-]+)$/.exec(location.hash || '');
    var t = m && document.getElementById(m[1]);
    if (!t || userScrolled || t.getBoundingClientRect().top <= box.getBoundingClientRect().top) return;
    try { t.scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (e) { t.scrollIntoView(true); }
    try { window.dispatchEvent(new Event('scroll')); } catch (e2) { /* ignore */ }
  }

  function announce(detail) { try { window.dispatchEvent(new CustomEvent('room26:events', { detail: detail })); } catch (e) { /* old browsers */ } }

  function render(list) {
    var cutoff = cutoffDate();
    list.forEach(function (ev) { ev._date = parseDate(ev.acf && ev.acf.start_date); });
    list = list.filter(function (ev) { return ev._date; });
    var upcoming = list.filter(function (ev) { return ev._date >= cutoff; }).sort(function (a, b) { return a._date - b._date; });
    var nextCutoff = new Date(cutoff.getTime() + 24 * 3600e3);
    announce({ ok: true, upcoming: upcoming.slice(0, 8).map(function (ev) { return { day: ev._date.getDay(), today: ev._date < nextCutoff }; }) });
    /* only nights still to come: past events are never shown */
    var shown = upcoming.slice(0, 12);
    title.textContent = 'Upcoming';
    if (!shown.length) {
      count.textContent = 'No dates published yet';
      grid.innerHTML = ''; grid.hidden = true;
      if (empty) empty.hidden = false;
      reanchor(); return;
    }
    var n = upcoming.length;
    count.textContent = (n > 12 ? '12 of ' + n : String(n)) + (n === 1 ? ' event' : ' events');
    if (empty) empty.hidden = true;
    grid.hidden = false;
    grid.innerHTML = '';
    shown.forEach(function (ev) { grid.appendChild(card(ev, false)); });
    var root = document.documentElement;
    if (window.IntersectionObserver && root.classList.contains('js') && !root.classList.contains('no-anim') && !root.classList.contains('reduced')) {
      Array.prototype.forEach.call(grid.children, function (c, i) { c.style.transitionDelay = (i * 60) + 'ms'; c.classList.add('reveal'); requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add('in'); }); }); });
    }
    reanchor();
  }

  var ctrl = ('AbortController' in window) ? new AbortController() : null;
  var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 9000) : null;
  fetch(API, { signal: ctrl ? ctrl.signal : undefined, mode: 'cors', credentials: 'omit' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) { if (timer) clearTimeout(timer); if (Array.isArray(data)) render(data); else throw new Error('bad payload'); })
    .catch(function () { if (timer) clearTimeout(timer); box.hidden = true; reanchor(); announce({ ok: false }); /* silent: residencies remain */ });
})();
