#!/usr/bin/env python3
"""Checks that every verbatim text from CONTENT.md (sections 3,4,6,7,8 + nav) is present in the built HTML.
Usage: python3 tools/check_content.py [index.html ...]  (defaults to index.html). Exit 1 if anything is missing."""
import re,sys,html,unicodedata,glob
files=sys.argv[1:] or ['index.html']
src=''
for f in files:
    s=open(f,encoding='utf-8').read()
    s=re.sub(r'<script.*?</script>','',s,flags=re.S); s=re.sub(r'<style.*?</style>','',s,flags=re.S)
    src+=' '+html.unescape(re.sub(r'<[^>]+>',' ',s))
def norm(t):
    t=unicodedata.normalize('NFKC',t)
    t=t.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','-').replace('–','-')
    t=re.sub(r'\s+',' ',t).strip().lower()
    return t
S=norm(src)
REQUIRED = [
 # nav
 "Home","Club","Ticket & Events","Corporate Events","Movie Set","Contacts","Find Us","The Club",
 # club
 "The Room26 Project was born in Rome from a group of entrepreneurs bound by a long-standing friendship, an endless love for music, dance, and art, and years of successful national and international experience in the world of entertainment.",
 "From the very beginning, the vision was clear: to create something Rome had never seen before. A place that draws inspiration from the best experiences around the world, infused with our passions, our visions, and our obsessions.",
 "Our success lies in the ability to truly interpret our audience. The goal is to shape an environment that evolves with the ever-changing tastes and expectations of our guests, while always anticipating their needs and desires.",
 "At the core of the project are two guiding principles: quality and communication. Conceived to celebrate the power of sound in its purest form, Room26 takes its name from the 26 state-of-the-art CROWN amplifiers that fuel its beating heart – the Room itself, our pride and joy.",
 "But Room26 is more than a club. It is a cultural hub, a gathering space where music, art, and creativity converge. A place where live experiences meet artistic expression, and where training and workshops aim to unlock the true potential of artists—beyond the demands and compromises of the market.",
 "Room26 is not just a venue.",
 "It is a movement, a state of mind, a sanctuary for those who live and breathe music.",
 "Technical Rider",
 "The system delivers a sound pressure of 130 dB SPL.",
 "The acoustic design of the room has been conceived as a true Auditorium for Dance Music: Topakustik wooden flooring and Fiberform materials ensure the ideal absorption coefficient for a flawless acoustic experience",
 "Main Room",
 "A hall renowned for its sound system, designed to elevate the element of Sound to its absolute highest expression.",
 "It takes its name from the 26 state-of-the-art CROWN amplifiers, housed within the very “Room26” – the beating heart of the project.",
 "Behind its DJ booth, internationally acclaimed artists take the stage every week.",
 "Click here to download the MAIN Room Technical Rider",
 "Plus Room",
 "The true gem of Room26, featuring outstanding acoustics and spacious areas designed to host 100 to 200 guests for private parties and corporate events.",
 "Every Friday and Saturday, our resident DJs bring you the very best in commercial music",
 "Click here to download the PLUS Room Technical Rider",
 # corporate
 "Room26 is not only a legendary club—it’s also one of Rome’s most exclusive venues for corporate events and private parties.",
 "With versatile spaces and a highly professional service, it delivers a truly premium experience.",
 "Its dynamic layout offers endless possibilities for creating engaging and memorable events.",
 "The multifunctional rooms can be transformed to host a wide variety of formats, making every occasion unique",
 "Included Services","Exclusive Venue","Use of the venue’s in-house audio, video, and lighting system",
 "Technical support during the event (audio/lighting technician)","Supervision of the restroom facilities during the event",
 "Cleaning Services","Staff for setup and teardown","Security staff managing guest entry and exit flow","Music Copyright License (SIAE)","WI-FI 2500/1000",
 "Extra Services","Dj","Live Vocal Performer","Technical support for LED wall operation (VJ)","Cloakroom Service","Hostess & Steward",
 "Bar service: open bar with soft drinks, wine, and prosecco","Cocktail","Catering service: buffet dinner",
 "Corporate Venue","Prestigious brands have chosen Room26 as the venue for their corporate events.",
 "Thanks to its versatility and advanced technical features, Room26 has built strong and long-lasting partnerships over the years.",
 # movie set
 "Many film production companies have chosen us as the set for their movies. Room26 not only offers two fully equipped halls designed for club events and a spacious outdoor area, but also provides its staff for the management of the advanced technical equipment available inside the venue. Discover some of the posters from the films shot here",
 # contact
 "Contact & Social","Stay tuned with us through our social channels, our official app, and our direct contacts.",
 "Cell.","+39 320 294 3332","+39 351 919 5320","Mail","Instagram","Tik Tok","Facebook","Threads","Telegram Channel","Whatsapp Channel","IOS App","Google","Android App",
 # footer
 "Powered by Goodphellas Web Solution","DEP 26 s.r.l.","Piazza Guglielmo Marconi, 31","00144 Roma","P.IVA/C.F. 17992721005","Torna su",
]
LINKS = ["tel://+393202943332","tel://+393519195320","mailto:info@room26.it","https://instagram.com/room26official","https://www.tiktok.com/@room26official",
 "https://www.facebook.com/room26official","https://twitter.com/room26official","https://www.threads.net/@room26official","https://t.me/room26official",
 "https://whatsapp.com/channel/0029VaCRo4fGpLHJHwVq5m1l","https://apps.apple.com/us/app/room26-club/id6478856480","https://g.page/room26official",
 "https://play.google.com/store/apps/details?id=it.room26.stardance","http://www.goodphellas.it","assets/pdf/Scheda-Tecnica-Room26.pdf","assets/pdf/Scheda-Tecnica-Plus.pdf",
 "https://bit.ly/AppRoom26"]
raw=''.join(open(f,encoding='utf-8').read() for f in files)
missing=[t for t in REQUIRED if norm(t) not in S]
ml=[l for l in LINKS if l not in raw and l.replace('tel://','tel:') not in raw]
for t in missing: print("MISSING TEXT:",t)
for l in ml: print("MISSING LINK:",l)
print(f"texts: {len(REQUIRED)-len(missing)}/{len(REQUIRED)} present · links: {len(LINKS)-len(ml)}/{len(LINKS)} present")
sys.exit(1 if (missing or ml) else 0)
