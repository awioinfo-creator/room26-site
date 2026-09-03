# ROOM26 — nuovo sito

Rifacimento del sito https://www.room26.it come **sito statico** (HTML + CSS + JS vanilla, nessun build step).
Tutti i testi, le foto, i PDF, i loghi e i link del sito attuale sono stati mantenuti verbatim (vedi `CONTENT.md`,
l'inventario usato come fonte di verità, e `tools/check_content.py` che lo verifica automaticamente).

## Struttura

```
index.html          pagina unica: hero, Ticket & Events, The Club, Corporate Events, Movie Set, Contact & Social, footer
css/style.css       design system (nero, Archivo / Inter / JetBrains Mono, motion, responsive)
js/main.js          header, menu mobile, chip "Tonight/Next", reveal, contatori, meter, manifesto, strip, lightbox
js/events.js        eventi live dall'API REST WordPress di room26.it (Upcoming / Latest)
assets/             tutti i media presi dal sito attuale (ottimizzati per il web)
  gallery/          14 foto ospiti internazionali (+ thumbs/ 640px) e 2 foto usate come sfondi
  formats/          cover dei 4 format settimanali (Milkshake, DRIP, 100% Room26, Báilame)
  rooms/            Main Room, ROOM_3-1, ROOM_7
  brands/           12 loghi Corporate Venue
  posters/          8 locandine Movie Set
  pdf/              Scheda-Tecnica-Room26.pdf, Scheda-Tecnica-Plus.pdf
  logos/            loghi/favicon originali
DESIGN_SPEC.md      specifica di design
CONTENT.md          inventario dei contenuti originali
tools/              strumenti di QA (server locale, screenshot headless, verifica testi)
```

## Deploy

È una cartella statica: basta caricare `index.html`, `css/`, `js/` e `assets/` su qualsiasi hosting (Apache, Nginx,
Netlify, Vercel, GitHub Pages, ecc.). Nessuna dipendenza server. I font sono caricati da Google Fonts.

Vecchi link mantenuti: `#!/club`, `#!/aziendali`, `#!/contact` vengono reindirizzati automaticamente alle nuove sezioni.

Vecchi URL di pagina: `events/index.html` e `set-cinematografici/index.html` sono stub che reindirizzano (meta refresh +
`location.replace`) a `/#events` e `/#movie-set`, così i link/bookmark a `/events/` e `/set-cinematografici/` non danno 404
su nessun hosting statico. Per Netlify c'è anche `_redirects` (301); su Apache si può usare in alternativa
`RewriteRule ^events/?$ /#events [R=301,NE,L]` e `RewriteRule ^set-cinematografici/?$ /#movie-set [R=301,NE,L]`.

`og:image` e il logo del JSON-LD puntano a `https://www.room26.it/assets/logos/…` (asset locali): se il dominio finale è
diverso, aggiornare i due URL assoluti in `index.html`.

### Eventi live

`js/events.js` legge gli eventi dall'API pubblica del WordPress attuale:
`https://www.room26.it/wp-json/wp/v2/events` (CORS aperto). Mostra i prossimi eventi ("Upcoming") o, se la stagione
non ha ancora date future, gli ultimi pubblicati ("Latest"). Ogni card rimanda alla pagina evento su room26.it.
La richiesta usa `per_page=100` con `_fields` annidati (solo i campi usati: ~100 KB raw / ~9 KB gzip) perché la lista
è ordinata per data di pubblicazione: con 12-24 righe le serate pubblicate con largo anticipo (Capodanno, headliner)
uscirebbero dalla finestra prima della loro data. Il blocco ha uno skeleton della stessa altezza (nessun salto di layout)
e il confine "Upcoming/Latest" è calcolato in ora di Roma: una serata conta fino alle 06:00 del mattino seguente.
Se il WordPress viene spento, basta cambiare la costante `API` in `js/events.js` (o rimuovere lo script: i quattro
format settimanali restano visibili comunque).

**Nota importante**: il pulsante "Tutti gli eventi" e le card evento puntano alle pagine `/events/` del WordPress
attuale. Se il nuovo sito sostituisce il WordPress sullo stesso dominio, va deciso dove restano le pagine evento
(es. WordPress su un sottodominio come `eventi.room26.it`, aggiornando `API` e i link).

### Cookie banner

Lo script iubenda del sito attuale (siteId 3532813, cookiePolicyId 85160644) è già presente in `index.html` dentro
un commento: rimuovere il commento per attivarlo sul dominio live.

## QA locale

```bash
bash tools/serve.sh                                     # serve su http://127.0.0.1:8126/
python3 tools/check_content.py                          # verifica che tutti i testi/link originali siano presenti
node tools/shot.mjs http://127.0.0.1:8126/ 1440 900 qa/d --full   # screenshot pagina intera (Chromium headless)
node tools/shot.mjs http://127.0.0.1:8126/ 390 844 qa/m 0,800,1600 --anim   # scroll reali con animazioni
```
