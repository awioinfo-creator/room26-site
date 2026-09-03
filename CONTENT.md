# ROOM26 — Content inventory (source of truth)

Every text below is copied verbatim from the current site https://www.room26.it (home one-pager with
#!/club, #!/aziendali, #!/contact routes, plus /events/ and /set-cinematografici/ pages).
ALL of these texts MUST appear in the new site, verbatim (typography like curly quotes/dashes may be kept).
Assets referenced are already downloaded under `assets/` (relative to the project root).

---------------------------------------------------------------------------------------------------
## 0. Meta / SEO
- `<title>`: Room26
- meta description: Storico locale Romano famoso per il suo impianto audio e per i suoi ospiti internazionali. Ideale per i party privati e per le feste aziendali.
- og:site_name: Room26 · locale it_IT · twitter @room26official
- Social sameAs: https://www.facebook.com/room26official , https://x.com/room26official , https://instagram.com/room26official
- Favicon: `assets/logos/fave.png` (70x70 white ROOM26 square) · `assets/logos/FAVI-HD-ROOM.png` (33x24)
- Logo (header, white on transparent, low-res 157x37): `assets/logos/LOGO-ROOM.png` — wordmark "ROOM" + "26" inside a rounded box.
  `assets/logos/ROOM26-LUNGO.png` (157x30 variant) · `assets/logos/logo-01.png` (400x300 black square logo on white, used as og:image)
  → It is fine (recommended) to redraw the wordmark as crisp inline SVG ("ROOM" + boxed "26") in the same spirit.

## 1. Navigation (header menu, in this order)
| Label            | Target                                                        |
|------------------|---------------------------------------------------------------|
| Home             | https://www.room26.it/  (→ top of page)                        |
| Club             | #!/club  (→ Club section)                                     |
| Ticket & Events  | https://www.room26.it/events/  (→ Events section)             |
| Corporate Events | #!/aziendali  (→ Corporate section)                           |
| Movie Set        | https://www.room26.it/set-cinematografici/ (→ Movie Set sect.)|
| Contacts         | #!/contact  (→ Contact section)                               |
| Find Us          | https://g.page/room26official  (external, Google Maps)        |
Also present: skip link "Vai ai contenuti" (→ #content) and footer "Torna su" (back to top).

Old deep links to preserve (JS redirect to the new anchors): `#!/club`, `#!/aziendali`, `#!/contact`.

## 2. Home / hero
The current hero is a full-height black row with three icon tiles (fade-in-up):
- "The Club"  → #!/club   (icon: house)
- "Ticket & Events" → https://bit.ly/AppRoom26 (icon: ticket) — this resolves to the app download link https://onelink.to/dr8vhe
- "Corporate Events" → #!/aziendali (icon: users-cog)
(Two rows with a "TRILOGY NYE 2026" flyer + "Buy Ticket" button https://www.ticketnation.it/lkp/1ce4et1a89/trilogy-nye-2026-room26 exist in the markup but are hidden on every viewport → NOT required.)

## 3. THE CLUB (section id club) — heading: "The Club"
Paragraphs (verbatim, in order):

1. The Room26 Project was born in Rome from a group of entrepreneurs bound by a long-standing friendship, an endless love for music, dance, and art, and years of successful national and international experience in the world of entertainment.
2. From the very beginning, the vision was clear: to create something Rome had never seen before. A place that draws inspiration from the best experiences around the world, infused with our passions, our visions, and our obsessions.
3. Our success lies in the ability to truly interpret our audience. The goal is to shape an environment that evolves with the ever-changing tastes and expectations of our guests, while always anticipating their needs and desires.
4. At the core of the project are two guiding principles: quality and communication. Conceived to celebrate the power of sound in its purest form, Room26 takes its name from the 26 state-of-the-art CROWN amplifiers that fuel its beating heart – the Room itself, our pride and joy.
5. But Room26 is more than a club. It is a cultural hub, a gathering space where music, art, and creativity converge. A place where live experiences meet artistic expression, and where training and workshops aim to unlock the true potential of artists—beyond the demands and compromises of the market.
6. Room26 is not just a venue.
7. It is a movement, a state of mind, a sanctuary for those who live and breathe music.

### Technical Rider (sub-heading: "Technical Rider")
- The system delivers a sound pressure of 130 dB SPL.
- The acoustic design of the room has been conceived as a true Auditorium for Dance Music: Topakustik wooden flooring and Fiberform materials ensure the ideal absorption coefficient for a flawless acoustic experience

### Main Room (card, background image `assets/rooms/main-room.jpg` — red-lit crowd shot)
- A hall renowned for its sound system, designed to elevate the element of Sound to its absolute highest expression.
- It takes its name from the 26 state-of-the-art CROWN amplifiers, housed within the very “Room26” – the beating heart of the project.
- Behind its DJ booth, internationally acclaimed artists take the stage every week.
- Button: "Click here to download the MAIN Room Technical Rider" → `assets/pdf/Scheda-Tecnica-Room26.pdf` (orig: https://www.room26.it/wp-content/uploads/2020/03/Scheda-Tecnica-Room26.pdf)

### Plus Room (card, background image `assets/gallery/LaylaBenitez000042.jpg` — wide blue club shot)
- The true gem of Room26, featuring outstanding acoustics and spacious areas designed to host 100 to 200 guests for private parties and corporate events.
- Every Friday and Saturday, our resident DJs bring you the very best in commercial music
- Button: "Click here to download the PLUS Room Technical Rider" → `assets/pdf/Scheda-Tecnica-Plus.pdf` (orig: https://www.room26.it/wp-content/uploads/2020/03/Scheda-Tecnica-Plus.pdf)

### Gallery (14 portrait/landscape photos of international guests, with zoom/lightbox)
All in `assets/gallery/` (web-optimized, max 1800px) with 640px thumbs in `assets/gallery/thumbs/`.
Artist names come from the filenames — may be used as captions ("DAVID MORALES", "ELI BROWN", "KASIA", "KOROLOVA", "LAYLA BENITEZ", "LOVRA", "OLYMPE", "TITA LAU", "VIVIANA CASANOVA"):
DavidMorales000081.jpg (portrait, b/w) · DavidMorales000087.jpg (portrait, red) · EliBrown000021.jpg (portrait, red) · EliBrown000026.jpg (portrait, b/w) ·
Kasia000003.jpg (portrait, b/w) · Kasia000022.jpg (portrait, blue) · Korolova000075.jpg (portrait, b/w) · LaylaBenitez000109.jpg (portrait, red) ·
Lovra000037.jpg (LANDSCAPE, dark) · Lovra000050.jpg (portrait, red crowd) · Olympe000075.jpg (portrait) · TitaLau000099.jpg (LANDSCAPE, red "TITA LAU" led) ·
TitaLau000102.jpg (portrait) · VivianaCasanova000037.jpg (portrait, b/w)
Extra (not in the gallery, used as backgrounds): DavidMorales000010.jpg (LANDSCAPE, wide blue club with crowd — great hero) · LaylaBenitez000042.jpg (LANDSCAPE, wide blue club — Plus Room card bg)

## 4. CORPORATE EVENTS (section id aziendali) — heading: "Corporate Events"
Intro paragraphs (verbatim):
1. Room26 is not only a legendary club—it’s also one of Rome’s most exclusive venues for corporate events and private parties.
2. With versatile spaces and a highly professional service, it delivers a truly premium experience.
3. Its dynamic layout offers endless possibilities for creating engaging and memorable events.
4. The multifunctional rooms can be transformed to host a wide variety of formats, making every occasion unique

### Included Services (card with bg `assets/rooms/ROOM_3-1.jpg`, 1020x248 b/w dj booth)
- Exclusive Venue
- Use of the venue’s in-house audio, video, and lighting system
- Technical support during the event (audio/lighting technician)
- Supervision of the restroom facilities during the event
- Cleaning Services
- Staff for setup and teardown
- Security staff managing guest entry and exit flow
- Music Copyright License (SIAE)
- WI-FI 2500/1000

### Extra Services (card with bg `assets/rooms/ROOM_7.jpg`, 1024x576 dark mixer close-up)
- Dj
- Live Vocal Performer
- Technical support for LED wall operation (VJ)
- Cloakroom Service
- Hostess & Steward
- Bar service: open bar with soft drinks, wine, and prosecco
- Cocktail
- Catering service: buffet dinner

### Corporate Venue (sub-heading: "Corporate Venue")
- Prestigious brands have chosen Room26 as the venue for their corporate events.
- Thanks to its versatility and advanced technical features, Room26 has built strong and long-lasting partnerships over the years.
Brand logos (300x300 PNG, colored on transparent — in this order, alt text):
`assets/brands/dhl.png` Dhl · `deca.png` Decathlon · `tim.png` Tim · `poste.png` Poste Italiane · `cisalfa.png` Cisalfa · `generali.png` Banca Generali ·
`tiger.png` Tiger · `progedil.png` Progedil · `samsung.png` Samsung · `riello.png` Riello · `toscano.png` Toscano · `goldman.png` Goldman Sachs

## 5. TICKET & EVENTS (page /events/ — "Tutti gli eventi")
Live data: WordPress REST API, CORS open (`Access-Control-Allow-Origin` echoes any origin):
`GET https://www.room26.it/wp-json/wp/v2/events?per_page=12&_fields=id,slug,title,link,acf`
Fields: `title.rendered`, `link` (event page), `acf.start_date` ("21/05/2026 23:00:00", dd/mm/yyyy), `acf.end_date`,
`acf.address_location`, `acf.sold_out` (bool), `acf.dj_name`, `acf.cover_square_url.url` (1080x1350 or 1280x1600 flyer),
`acf.cover_vertical_url.url` (900x1600), `acf.cover_horizontal_url.url` (1600x837), `acf.cover_*_url.sizes.large`,
`content.rendered` (HTML description). List is ordered by publish date desc (= newest first). Total 255 events (3 pages of 100).
Listing card format used on the old site: "Gio 21 Mag 2026 | Start @ 23:00" / TITLE / "Piazza Guglielmo Marconi, 31 Roma" / excerpt.
Season note: the last published events are the May 2026 "Closing Party" nights; the new season may have no future events yet →
the UI must handle "no upcoming events" gracefully (show the latest ones as "Latest" or show the weekly formats + app CTA).

Weekly formats (residencies) with local covers in `assets/formats/` (`*-square.jpg` 1080x1350 · `*-wide.jpg` 1600x837 · `*-vertical.jpg` 900x1600):
- THURSDAY — MILKSHAKE PARTY (`milkshake-*`): "Thursday night = the best party in town! The legendary MilkShake Party is back at Room26! Since 2001, MilkShake has been the Thursday night institution in Rome’s nightlife, born as a party for lovers of Hip-Hop, R&B, and Dancehall." Opening 23:00.
- FRIDAY — DRIP FRIDAY (`drip-*`): "Enjoy the Happiness. Enjoy the Drip. DRIP is not just a party, it’s a lifestyle. Friday night at Room26 becomes the home of Urban culture, with the hottest sounds and the freshest style in town." Line-up DJ Fabio Angeli · DJ Mattia Olivi. Urban Beats → Hip-Hop / R&B / Reggaeton / Afro-Beats / Trap.
- SATURDAY — 100% ROOM26 (`100room26-*`): "Saturday nights at Room26 are where the real clubbing experience happens. Join us for a night of pure energy, cutting-edge sound, and the signature Tech House grooves that define our main stage." Main Room: DJ Miki Stentella. Tech House / Club Beats.
- SUNDAY — BÁILAME (`bailame-*`): "Rome’s most iconic Sunday party" — Reggaeton • Latin Club • Urban Dance (Plus Room only — as every Báilame Sunday).
Info, guest lists & table reservations: +39 320 2943332 (Call & WhatsApp). Doors open 23:00.
Ticket / app CTA: https://bit.ly/AppRoom26 (→ https://onelink.to/dr8vhe) — "Ticket & Events" hero tile points here.

## 6. MOVIE SET (page /set-cinematografici/) — heading: "Movie Set"
Paragraph (verbatim): Many film production companies have chosen us as the set for their movies. Room26 not only offers two fully equipped halls designed for club events and a spacious outdoor area, but also provides its staff for the management of the advanced technical equipment available inside the venue. Discover some of the posters from the films shot here
Posters (`assets/posters/`): appena-un-minuto.jpg (Appena un minuto) · benedetta-follia.jpg (Benedetta follia, 358x512 small) · il-campione.jpg (Il campione) ·
immaturi.jpg (Immaturi) · io-loro-e-lara.jpg (Io, loro e Lara, 512x506 nearly square) · poster-2021-02.jpg (Speravo de morì prima — Sky) ·
poster-2021-03.jpg (Genitori vs Influencer — Sky) · ti-stimo-fratello.jpg (Ti stimo fratello)

## 7. CONTACT & SOCIAL (section id contact) — heading: "Contact & Social"
Intro: Stay tuned with us through our social channels, our official app, and our direct contacts.
Items (label → link), in this order:
- Cell. → tel://+393202943332  (display +39 320 294 3332)
- Mail → mailto:info@room26.it
- Instagram → https://instagram.com/room26official
- Tik Tok → https://www.tiktok.com/@room26official
- Facebook → https://www.facebook.com/room26official
- X → https://twitter.com/room26official
- Threads → https://www.threads.net/@room26official
- Telegram Channel → https://t.me/room26official
- Whatsapp Channel → https://whatsapp.com/channel/0029VaCRo4fGpLHJHwVq5m1l
- IOS App → https://apps.apple.com/us/app/room26-club/id6478856480
- Google → https://g.page/room26official
- Android App → https://play.google.com/store/apps/details?id=it.room26.stardance
(Sub-pages footer also lists a second phone: +39 351 919 5320 → tel://+393519195320, and "Room26 App" labels for the stores.)

## 8. FOOTER
- Powered by Goodphellas Web Solution → http://www.goodphellas.it
- DEP 26 s.r.l.
- Piazza Guglielmo Marconi, 31
- 00144 Roma
- P.IVA/C.F. 17992721005
- Torna su (back to top)
- Cookie banner: iubenda siteId 3532813 / cookiePolicyId 85160644 (script https://cs.iubenda.com/autoblocking/3532813.js) — keep a note/placeholder.

## 9. Location facts (from event pages, useful for a "How to reach" block)
Room26 – Piazza Guglielmo Marconi 31, Rome (EUR). Metro B (Blue Line) towards Laurentina → Eur Palasport, short walk.
From Fiumicino Airport: Leonardo Express to Roma Termini, then Metro B.
