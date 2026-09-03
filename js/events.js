/* ROOM26 — events.js
   Live events from the club's WordPress REST API (CORS is open on room26.it).
   Shows "Upcoming" (start_date >= today, ascending) or, if the season has no future dates yet,
   the most recent nights under "Latest". Fails silently: the weekly residencies stay visible. */
(function () {
  'use strict';
  var API = 'https://www.room26.it/wp-json/wp/v2/events?per_page=24&_fields=id,slug,title,link,acf';
  var box = document.getElementById('live');
  var grid = document.getElementById('live-grid');
  var title = document.getElementById('live-title');
  var count = document.getElementById('live-count');
  if (!box || !grid || !('fetch' in window)) return;

  var DAYS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  var MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  var PLACE = 'Piazza Guglielmo Marconi, 31 Roma';

  /* "21/05/2026 23:00:00" -> Date (local) */
  function parseDate(s) {
    if (!s) return null;
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(String(s).trim());
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], m[4] ? +m[4] : 23, m[5] ? +m[5] : 0, 0, 0);
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /* old listing format: "Gio 21 Mag 2026 | Start @ 23:00" */
  function fmtDate(d) { return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ' | Start @ ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function decode(s) { var t = document.createElement('textarea'); t.innerHTML = s || ''; return t.value; }
  function cover(acf) {
    var c = acf && (acf.cover_square_url || acf.cover_vertical_url || acf.cover_horizontal_url);
    if (!c || typeof c !== 'object') return '';
    var url = (c.sizes && (c.sizes.large || c.sizes.medium_large)) || c.url || '';
    return /^https:\/\/www\.room26\.it\//.test(url) ? url : '';
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function card(ev, past) {
    var a = el('a', 'ev' + (past ? ' past' : ''));
    a.href = /^https:\/\/www\.room26\.it\//.test(ev.link || '') ? ev.link : 'https://www.room26.it/events/';
    a.target = '_blank'; a.rel = 'noopener';
    var media = el('div', 'ev-media');
    var src = cover(ev.acf);
    if (src) { var img = el('img'); img.src = src; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.width = 819; img.height = 1024; media.appendChild(img); }
    a.appendChild(media);
    if (ev.acf && ev.acf.sold_out) a.appendChild(el('span', 'ev-tape', 'Sold out'));
    var body = el('div', 'ev-body');
    body.appendChild(el('p', 'ev-date mono', ev._date ? fmtDate(ev._date) : ''));
    body.appendChild(el('h4', 'ev-title', decode(ev.title && ev.title.rendered)));
    body.appendChild(el('p', 'ev-place', (ev.acf && ev.acf.address_location) || PLACE));
    a.appendChild(body);
    return a;
  }

  function render(list) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0); /* a night counts until 06:00 */
    list.forEach(function (ev) { ev._date = parseDate(ev.acf && ev.acf.start_date); });
    list = list.filter(function (ev) { return ev._date; });
    var upcoming = list.filter(function (ev) { return ev._date >= today; }).sort(function (a, b) { return a._date - b._date; });
    var past = false, shown = upcoming;
    if (!upcoming.length) {
      past = true;
      shown = list.slice().sort(function (a, b) { return b._date - a._date; }).slice(0, 8);
      title.textContent = 'Latest';
      count.textContent = 'Season closed · new dates soon';
    } else {
      title.textContent = 'Upcoming';
      count.textContent = upcoming.length + (upcoming.length === 1 ? ' event' : ' events');
      shown = upcoming.slice(0, 12);
    }
    if (!shown.length) return;
    grid.innerHTML = '';
    shown.forEach(function (ev) { grid.appendChild(card(ev, past)); });
    box.hidden = false;
    if (window.IntersectionObserver && document.documentElement.classList.contains('js') && !document.documentElement.classList.contains('no-anim')) {
      Array.prototype.forEach.call(grid.children, function (c, i) { c.style.transitionDelay = (i * 60) + 'ms'; c.classList.add('reveal'); requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add('in'); }); }); });
    }
  }

  var ctrl = ('AbortController' in window) ? new AbortController() : null;
  var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 9000) : null;
  fetch(API, { signal: ctrl ? ctrl.signal : undefined, mode: 'cors', credentials: 'omit' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) { if (timer) clearTimeout(timer); if (Array.isArray(data)) render(data); })
    .catch(function () { if (timer) clearTimeout(timer); /* silent: residencies remain */ });
})();
