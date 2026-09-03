# ROOM26 — Design specification (v1, 2026-09-02)

Direction chosen: **"A Night In One Take"** (cinematic/editorial) as the spine, with two grafts:
**Signal Chain** (the 26 CROWN amplifiers / 130 dB become UI: numbered sections, mono telemetry labels,
count-up readouts, a 26-segment SPL meter) and **Marquee** (the weekday residencies board with day tints,
brand logos on white chips in a marquee, sticky stacking room cards, guest list with hover photo).
Everything on pure black, every text of CONTENT.md verbatim, every asset from the current site.

## Principles
1. Black is the stage. Photography is the only saturated colour; UI is white/grey plus one signal red.
2. Giant grotesk title cards (Hï Ibiza) — but the words are the club's own words.
3. Data as ornament: numbers (26, 130 dB, 100–200, 23:00) in display size, labels in mono.
4. Motion is choreography, not decoration: load sequence, scroll reveals, marquees; all disabled under
   `prefers-reduced-motion` and under `html.no-anim` (QA hook).
5. Progressive enhancement: every text and image is in the HTML; JS only adds live events, lightbox,
   menu, counters, ken-burns.

## Typography (Google Fonts, one request, display=swap)
- Display `Archivo` variable (wght 500–900, wdth 100–125). Uppercase via CSS only.
- Body `Inter` 400/500/600. Never transformed.
- Meta `JetBrains Mono` 400/500 — labels, dates, buttons, eyebrows; uppercase, tracking .12em.
Scale (clamp): title card `clamp(3.25rem, 11vw, 12rem)` lh .86 · manifesto `clamp(2rem, 6vw, 6.5rem)` ·
H2 `clamp(1.75rem, 3.6vw, 3.5rem)` · card title `clamp(1.25rem, 2vw, 1.875rem)` · lead `clamp(1.2rem,1.8vw,1.7rem)` ·
body `clamp(1.0625rem,1.1vw,1.2rem)` lh 1.55 · meta .75rem · readouts `clamp(4rem, 12vw, 12rem)`.

## Colour tokens
`--black #000` page · `--ink-2 #0a0a0a` cards · `--ink-3 #141414` tiles · `--line rgba(255,255,255,.14)` ·
`--white #fff` · `--paper #f5f5f3` body · `--g30 #b3b3b3` secondary · `--g60 #6b6b6b` muted ·
`--crown #ff2a2a` signal red (dots, SOLD OUT, focus ring, hover underline; never a surface).
Day tints (Events only): THU `#ff2a2a` · FRI `#e31cc2` · SAT `#37f58c` · SUN `#ff2d8a`.
Brand logos are coloured PNGs → they sit on white chips (`#fff`, radius 12px) inside the marquee: the only
light surface on the site, by design.

## Layout
Page padding `clamp(20px, 5vw, 96px)`; 12-col grid max 1600px; hairline rules full-bleed; sections numbered in page
order `01 Ticket & Events · 02 The Club (02.2 Technical Rider, 02.4 guests) · 03 Corporate Events (03.3 partners) · 04 Movie Set · 05 Contact & Social`.
Breakpoints: ≤640 (mobile), ≤900 (tablet), ≤1100 (small desktop).

## Header / navigation
Fixed, transparent over the hero, becomes `rgba(0,0,0,.72)` + blur after 40px scroll. Left: SVG wordmark
(ROOM + boxed 26, height 22px). Right (≥1100px): the 7 nav items in mono — Home, Club, Ticket & Events,
Corporate Events, Movie Set, Contacts, Find Us (external). Below 1100px a "Menu" button opens a full-screen
black overlay with the items in display size (staggered rise), Esc/backdrop closes, focus returns.
Legacy routes: JS maps `#!/club → #club`, `#!/aziendali → #aziendali`, `#!/contact → #contact`,
`#!/events → #events`. Skip link "Vai ai contenuti" → `#content` (`<main>`).

## Sections (page order)
### 00 Hero (`#top`)
100svh, `assets/gallery/DavidMorales000010.jpg` full-bleed (eager, preload), brightness .7 + bottom scrim,
Ken-Burns 18s then 40s drift. Bottom-left: mono kicker (address · live chip "TONIGHT · SAT" / "NEXT · THU"
computed in Europe/Rome), giant SVG wordmark, then the three tiles from the current hero as ticket strips:
"The Club" → `#club`, "Ticket & Events" → `https://bit.ly/AppRoom26` (external), "Corporate Events" → `#aziendali`.
Load choreography: photo fade+scale → wordmark letters rise (clip-path, 60ms stagger) → "26" box stroke draw
→ tiles fade-in-up (homage to the current fadeInUp). Scroll cue at the right.
### Ticker band
Mono marquee: `ROOM26 · PIAZZA GUGLIELMO MARCONI, 31 · 00144 ROMA · DOORS OPEN 23:00 · INFO, GUEST LISTS &
TABLE RESERVATIONS +39 320 2943332 (CALL & WHATSAPP) · 26 CROWN AMPLIFIERS · 130 dB SPL` (facts from CONTENT.md).
### 01 Ticket & Events (`#events`) — placed right after the hero because it is the centrepiece
Title card "Ticket & Events" + "Tutti gli eventi" eyebrow. (a) Residencies board: 4 cards THU MILKSHAKE PARTY /
FRI DRIP FRIDAY / SAT 100% ROOM26 / SUN BÁILAME — `assets/formats/*-square.jpg`, giant weekday spine in the
day tint, name, short verbatim description, "Opening 23:00", the info line with the phone. Horizontal snap
scroll on mobile, 4-col grid on desktop; the current/next night gets the pulsing "TONIGHT/NEXT" chip.
(b) Live grid: fetch WP REST (see CONTENT.md §5); "Upcoming" (start ≥ today, ascending) or, if none, "Latest"
(most recent first, 8 cards). Card: cover square (sizes.large → url), date in the old format
"Gio 21 Mag 2026 | Start @ 23:00", title (textContent), "Piazza Guglielmo Marconi, 31 Roma", SOLD OUT tape,
link to the event page (new tab). Skeleton while loading; on error the block hides itself.
(c) CTA row: white pill "Ticket & Events" → app link, outline pill "Tutti gli eventi" → https://www.room26.it/events/.
### 02 The Club (`#club`)
Title card with `assets/gallery/Lovra000037.jpg` (dark landscape) and "The Club". Editorial 2-col: sticky
left rail with readouts 26 / 130 dB / 100–200 (count-up), right column paragraphs 1–5 (p1 lead) then the
manifesto lines 6–7 in display size (word-by-word brighten on scroll). Technical Rider block: H2 "Technical
Rider", 26-segment SPL meter lighting left→right when in view, the two verbatim sentences as rows.
Rooms: two sticky stacking cards — Main Room (`assets/rooms/main-room.jpg`) and Plus Room
(`assets/gallery/LaylaBenitez000042.jpg`) with their sentences and the PDF buttons (verbatim labels, `download`).
Guests: display marquee of the artist names, then a horizontal filmstrip of the 14 photos (thumbs), lightbox
(full-size, captions, Esc/←/→), counter 01/14.
### 03 Corporate Events (`#aziendali`)
Title card with `assets/gallery/TitaLau000099.jpg`; intro paragraphs (p1 lead). Two service cards over
`assets/rooms/ROOM_3-1.jpg` (Included Services) and `assets/rooms/ROOM_7.jpg` (Extra Services), lists with
animated bullets. "Corporate Venue" H2 + the two sentences + brand marquee (12 logos on white chips, alt texts).
CTA: "Contacts" → `#contact`.
### 04 Movie Set (`#movie-set`, alias `#set-cinematografici`)
Title "Movie Set", verbatim paragraph, poster filmstrip (8 posters, hover lift, lightbox).
### 05 Contact & Social (`#contact`)
Title "Contact & Social", intro sentence, 12 tiles in the CONTENT order with inline SVG icons and labels
(Cell., Mail, Instagram, Tik Tok, Facebook, X, Threads, Telegram Channel, Whatsapp Channel, IOS App, Google,
Android App) each an external link; the phone tile shows +39 320 294 3332. Store badges row.
### Footer
Wordmark large (outline text), columns: address (Piazza Guglielmo Marconi, 31 / 00144 Roma), company
(DEP 26 s.r.l. / P.IVA/C.F. 17992721005), "Powered by Goodphellas Web Solution" link, "Torna su" button.
Cookie banner: iubenda placeholder (commented) with the IDs.

## Accessibility & performance
Landmarks, heading order, alt texts, visible focus ring (`--crown`), keyboard menu/lightbox, reduced motion,
`loading="lazy"` + width/height on every below-the-fold image, thumbs for grids, preconnect fonts,
no layout dependent on JS. QA hook: `#__scroll=<px>` → `html.no-anim` + instant scroll.
