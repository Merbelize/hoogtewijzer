# HoogteWijzer

HoogteWijzer is een mobiele webapp voor het kiezen van een passend arbeidsmiddel bij
werken op hoogte. De gebruiker vult een werksituatie in en ontvangt:

- een veilig basisadvies met duidelijke reden;
- stopmeldingen en controlepunten voor de start;
- persoonlijk AI-advies in eenvoudige taal via de OpenAI Responses API;
- een gecontroleerd basisadvies wanneer AI tijdelijk niet bereikbaar is;
- een bewaarbaar en deelbaar verslag.

De app is geschikt voor smartphone, tablet en desktop. Zij kan vanaf een beveiligde
website op het beginscherm worden geinstalleerd. Voor het live AI-advies is een
internetverbinding met de server nodig.

## Gewoon Via Een Link Gebruiken

De gebruiker hoeft geen Node.js te installeren of commando's uit te voeren. De app kan
op Render worden gepubliceerd en is daarna bereikbaar via een veilige internetlink,
bijvoorbeeld `https://hoogtewijzer.onrender.com`.

De servertechniek blijft alleen op de achtergrond nodig om de AI-sleutel te beschermen.
Een API-sleutel mag niet rechtstreeks in een mobiele app of openbare webpagina staan.

In [PUBLICEREN.md](./PUBLICEREN.md) staat het eenvoudige publicatieproces.

## Veiligheidsprincipe

De vaste beslisregels blijven altijd leidend. De volgorde is:

1. Voorkom werken op hoogte als dat kan.
2. Geef een veilige werkvloer of collectieve bescherming voorrang.
3. Kies pas daarna een passend tijdelijk arbeidsmiddel.
4. Laat het werk niet starten bij een concrete blokkade, zoals een onstabiele
   ondergrond, onveilig weer, ongecontroleerd verkeer, een afgekeurd arbeidsmiddel of
   onvoldoende bekwaamheid.

Het basisadvies draait op vaste, controleerbare regels. AI maakt hiervan een
menselijke, taakgerichte uitleg en kan vragen van de gebruiker beantwoorden. AI kan
een stopadvies niet opheffen of een onveiliger middel adviseren.

## Starten

Vereist: Node.js 20.10 of nieuwer.

```powershell
npm start
```

Open daarna `http://127.0.0.1:4173`.

In deze Codex-werkmap kan de meegeleverde Node-runtime worden gebruikt:

```powershell
& 'C:\Users\MvdMerbel\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --env-file-if-exists=.env server.mjs
```

## AI Activeren

De vaste keuzehulp kan zonder AI blijven functioneren, zodat een storing nooit leidt
tot een oncontroleerbaar advies. Voor de bedoelde werking van de app activeer je het
live AI-advies op de server.

Voor AI-advies:

1. Maak een kopie van `.env.example` als `.env`.
2. Vul in `.env` een server-side `OPENAI_API_KEY` in.
3. Start de app opnieuw.

De standaardinstelling gebruikt `gpt-5.4-mini` via de OpenAI Responses API. Dit model
is geschikt voor korte uitleg met lagere vertraging en lagere kosten dan een groot
frontiermodel. De modelnaam kan in `.env` worden aangepast.

Belangrijk:

- Plaats de API-sleutel nooit in `public/` of in browsercode.
- Wanneer de gebruiker op **Maak AI-advies** drukt, worden de ingevulde
  scenario-informatie en de vraag naar de ingestelde AI-dienst gestuurd.
- Vraag gebruikers daarom geen persoonsgegevens in te vullen.
- Stel voor een online gedeelde versie ook `AI_ACCESS_CODE` in. De app vraagt deze
  code voordat AI gebruikt wordt en begrenst herhaald AI-gebruik.

## Gebruik In De Praktijk

Voor ingebruikname binnen een organisatie:

1. Laat de beslisregels valideren door een veiligheidskundige en de betrokken
   praktijkdeskundigen.
2. Vul de middelenlijst en bedrijfsafspraken aan op basis van de eigen RI&E,
   arbocatalogus en werkinstructies.
3. Test representatieve werksituaties en vergelijk de uitkomst met de beoordeling van
   een deskundige.
4. Publiceer de app via HTTPS; installatie en offline werking op mobiele apparaten
   werken dan betrouwbaar.

HoogteWijzer vervangt geen RI&E, LMRA, gebruiksinstructie, keuring, toezicht of
vrijgave door de werkgever of verantwoordelijke.

## Controle

De automatische controles uitvoeren:

```powershell
npm run check
```

## Bronnen Voor De Beslisregels

Geraadpleegd op 27 mei 2026:

- [Arboportaal: Werken op hoogte](https://www.arboportaal.nl/onderwerpen/inrichting-werkvloer/werken-op-hoogte)
- [Arboportaal: Wat zegt de wet over werken op hoogte?](https://www.arboportaal.nl/onderwerpen/inrichting-werkvloer/werken-op-hoogte/wat-zegt-de-wet-over-werken-op-hoogte)
- [Arboportaal: Mogelijke maatregelen en tips](https://www.arboportaal.nl/onderwerpen/inrichting-werkvloer/werken-op-hoogte/tips-om-veilig-te-werken-op-hoogte)
- [Nederlandse Arbeidsinspectie: Rolsteigers](https://www.nlarbeidsinspectie.nl/onderwerpen/arbeidsomstandighedenwet/rolsteigers)
- [Arboportaal: Keuring van arbeidsmiddelen](https://www.arboportaal.nl/onderwerpen/veiligheid-op-het-werk/arbeidsmiddelen/keuring-van-arbeidsmiddelen)
- [OpenAI: modelinformatie GPT-5.4 mini](https://developers.openai.com/api/docs/models)
