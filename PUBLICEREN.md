# HoogteWijzer Online Zetten

Na publicatie gebruik je HoogteWijzer gewoon via een link. Op smartphone en tablet kan
de app daarna aan het beginscherm worden toegevoegd.

## Aanbevolen Route: Render

Render past goed bij deze app, omdat het zowel de app als de beveiligde AI-verbinding
kan uitvoeren. De instellingen staan al klaar in `render.yaml`.

Wat eenmalig nodig is:

1. Een account bij [Render](https://render.com/).
2. Een GitHub-, GitLab- of Bitbucket-opslagplaats met deze appbestanden.
3. Een OpenAI API-sleutel voor het AI-advies.
4. Een zelfgekozen toegangscode die je met testers deelt.

## Publiceren

1. Plaats deze map in een persoonlijke code-opslagplaats, bijvoorbeeld op GitHub.
   Let op: behoud de mappenstructuur. Upload dus niet alle losse bestanden plat in
   de hoofdmap.

   De structuur moet beginnen met:

   ```text
   public/
     assets/
     modules/
     app.js
     index.html
     styles.css
   test/
   server.mjs
   package.json
   render.yaml
   ```

   Controleer vooral dat deze bestanden en mappen in GitHub staan:

   - `server.mjs`
   - `package.json`
   - `render.yaml`
   - `public/index.html`
   - `public/app.js`
   - `public/modules/engine.js`
   - `public/assets/icon-192.png`
   - `public/assets/icon-512.png`

2. Kies in Render voor **New** en daarna **Blueprint**.
3. Koppel de opslagplaats van HoogteWijzer.
4. Render leest automatisch het bestand `render.yaml`.
5. Vul wanneer Render daarom vraagt twee geheime waarden in:

   - `OPENAI_API_KEY`: de geheime sleutel voor AI.
   - `AI_ACCESS_CODE`: een toegangscode voor de personen die AI mogen gebruiken.

6. Start de publicatie. Render geeft daarna een `https`-link.

## Gebruik Op Telefoon Of Tablet

1. Open de Render-link in de browser.
2. Kies in het browsermenu voor **Zet op beginscherm** of **Installeer app**.
3. Deel de AI-toegangscode alleen met de beoogde gebruikers.

## Waarom Geen Los Bestand?

Een losse webpagina kan de vragenlijst wel tonen, maar kan de geheime OpenAI-sleutel
niet veilig bewaren. Zonder beveiligd serverdeel zou iemand de sleutel kunnen
achterhalen en op jouw kosten AI gebruiken.

## Voor Praktijkgebruik

Voor inzet buiten een scriptieproef moeten een veiligheidskundige en de organisatie de
beslisregels, persoonsgegevens, kostenbeheersing en toegang beoordelen.
