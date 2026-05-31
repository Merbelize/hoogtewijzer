<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#123b4a">
    <meta name="description" content="HoogteWijzer helpt bij het kiezen van een veilig arbeidsmiddel voor werken op hoogte.">
    <title>HoogteWijzer | Veilig werken op hoogte</title>
    <link rel="icon" href="/assets/icon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/assets/icon-192.png">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="stylesheet" href="/styles.css">
    <script type="module" src="/app.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#keuzehulp">Ga naar de keuzehulp</a>
    <header class="topbar">
      <a class="brand" href="/" aria-label="HoogteWijzer startpagina">
        <img src="/assets/icon.svg" alt="" width="44" height="44">
        <span><strong>HoogteWijzer</strong><small>Veilig arbeidsmiddeladvies</small></span>
      </a>
      <div class="top-actions">
        <button class="ghost compact" id="saved-toggle" type="button">Opgeslagen</button>
        <button class="ghost compact install-button" id="install-button" type="button" hidden>Installeer app</button>
      </div>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">Keuzehulp werken op hoogte</p>
          <h1 id="hero-title">Kies een passende en veilige werkplek</h1>
          <p class="intro">
            Beantwoord enkele praktische vragen. Je krijgt direct een onderbouwd basisadvies,
            controlepunten en persoonlijk AI-advies voor jouw werksituatie.
          </p>
        </div>
        <div class="principles" aria-label="Veilige volgorde">
          <p class="principles-title">Veilige volgorde</p>
          <ol>
            <li>Voorkom werken op hoogte</li>
            <li>Kies collectieve bescherming</li>
            <li>Gebruik een passend arbeidsmiddel</li>
            <li>Controleer voor de start</li>
          </ol>
        </div>
      </section>

      <div class="notice" role="note">
        <strong>Belangrijk:</strong> HoogteWijzer ondersteunt de voorbereiding. De uitkomst
        vervangt geen RI&amp;E, LMRA, keuring, instructie of vrijgave door de verantwoordelijke.
      </div>

      <div class="layout">
        <section class="wizard card" id="keuzehulp" aria-label="Nieuwe beoordeling">
          <div class="card-head">
            <div>
              <p class="eyebrow">Nieuwe beoordeling</p>
              <h2>Beschrijf de klus</h2>
            </div>
            <button class="text-button" id="new-assessment" type="button">Opnieuw beginnen</button>
          </div>

          <nav class="steps" aria-label="Stappen">
            <button class="step active" type="button" data-go-step="1" aria-current="step">
              <span>1</span> Opdracht
            </button>
            <button class="step" type="button" data-go-step="2">
              <span>2</span> Risico's
            </button>
            <button class="step" type="button" data-go-step="3">
              <span>3</span> Middelen
            </button>
            <button class="step" type="button" data-go-step="4">
              <span>4</span> Advies
            </button>
          </nav>

          <form id="assessment-form" novalidate>
            <section class="panel active" data-panel="1" aria-labelledby="panel-one-title">
              <h3 id="panel-one-title" tabindex="-1">Wat ga je doen?</h3>
              <div class="fields two-columns">
                <label class="field wide">
                  <span>Naam van de klus <em>verplicht</em></span>
                  <input name="taskName" type="text" maxlength="100" required placeholder="Bijvoorbeeld: lamp vervangen in magazijn">
                </label>
                <label class="field">
                  <span>Locatie of werkgebied</span>
                  <input name="location" type="text" maxlength="100" placeholder="Bijvoorbeeld: hal B">
                </label>
                <label class="field">
                  <span>Datum beoordeling</span>
                  <input name="assessmentDate" type="date">
                </label>
                <label class="field">
                  <span>Soort werk</span>
                  <select name="workType">
                    <option value="inspection">Inspectie of opname</option>
                    <option value="maintenance" selected>Onderhoud of reiniging</option>
                    <option value="installation">Montage of installatie</option>
                    <option value="painting">Schilder- of gevelwerk</option>
                    <option value="logistics">Materiaal plaatsen of verplaatsen</option>
                    <option value="other">Overig werk</option>
                  </select>
                </label>
                <label class="field">
                  <span>Mogelijke valhoogte in meters <em>verplicht</em></span>
                  <input name="fallHeight" type="number" inputmode="decimal" min="0" max="100" step="0.1" required placeholder="2,5">
                  <small>Ook onder 2,50 m kan valgevaar bestaan.</small>
                </label>
                <label class="field">
                  <span>Hoe lang duurt het werk?</span>
                  <select name="duration">
                    <option value="brief">Korter dan 15 minuten</option>
                    <option value="short" selected>15 tot 60 minuten</option>
                    <option value="halfDay">1 tot 4 uur</option>
                    <option value="day">Langer dan 4 uur</option>
                  </select>
                </label>
                <label class="field">
                  <span>Hoe vaak vindt dit werk plaats?</span>
                  <select name="frequency">
                    <option value="once">Eenmalig</option>
                    <option value="sometimes">Enkele keren per jaar</option>
                    <option value="often">Regelmatig</option>
                  </select>
                </label>
              </div>
            </section>

            <section class="panel" data-panel="2" aria-labelledby="panel-two-title" hidden>
              <h3 id="panel-two-title" tabindex="-1">Welke risico's zijn er?</h3>
              <fieldset class="choice-block">
                <legend>Kan het werk vanaf de grond worden uitgevoerd?</legend>
                <div class="segmented">
                  <label><input type="radio" name="avoidHeight" value="yes"> Ja</label>
                  <label><input type="radio" name="avoidHeight" value="no"> Nee</label>
                  <label><input type="radio" name="avoidHeight" value="unknown" checked> Nog beoordelen</label>
                </div>
              </fieldset>
              <fieldset class="choice-block">
                <legend>Is er al een veilige werkvloer of bordes met randbeveiliging?</legend>
                <div class="segmented">
                  <label><input type="radio" name="protectedPlatform" value="yes"> Ja</label>
                  <label><input type="radio" name="protectedPlatform" value="no" checked> Nee</label>
                  <label><input type="radio" name="protectedPlatform" value="unknown"> Onbekend</label>
                </div>
              </fieldset>
              <fieldset class="choice-block">
                <legend>Kenmerken van de taak</legend>
                <div class="checks">
                  <label><input type="checkbox" name="twoHands"> Twee handen nodig tijdens het werk</label>
                  <label><input type="checkbox" name="forceRequired"> Kracht zetten of zijwaarts reiken</label>
                  <label><input type="checkbox" name="heavyMaterials"> Zwaar of groot materiaal meenemen</label>
                  <label><input type="checkbox" name="moveOften"> Veel verplaatsen langs het werkvlak</label>
                </div>
              </fieldset>
              <fieldset class="choice-block">
                <legend>Wat bevindt zich in of onder het werkgebied?</legend>
                <div class="checks grid">
                  <label><input type="checkbox" name="hazards" value="openings"> Openingen of gaten</label>
                  <label><input type="checkbox" name="hazards" value="fragileRoof"> Breekbaar dak</label>
                  <label><input type="checkbox" name="hazards" value="traffic"> Verkeer of transport</label>
                  <label><input type="checkbox" name="hazards" value="water"> Water</label>
                  <label><input type="checkbox" name="hazards" value="machinery"> Machines</label>
                  <label><input type="checkbox" name="hazards" value="sharpObjects"> Uitstekende delen</label>
                  <label><input type="checkbox" name="hazards" value="publicArea"> Publiek</label>
                  <label><input type="checkbox" name="hazards" value="electricity"> Elektriciteit</label>
                </div>
              </fieldset>
              <div class="fields three-columns">
                <label class="field">
                  <span>Ondergrond</span>
                  <select name="surface">
                    <option value="unknown">Nog controleren</option>
                    <option value="stable">Stabiel en draagkrachtig</option>
                    <option value="unstable">Niet stabiel of niet draagkrachtig</option>
                  </select>
                </label>
                <label class="field">
                  <span>Opstelruimte</span>
                  <select name="space">
                    <option value="unknown">Nog controleren</option>
                    <option value="ample">Voldoende ruimte</option>
                    <option value="limited">Beperkte ruimte</option>
                    <option value="none">Geen veilige opstelruimte</option>
                  </select>
                </label>
                <label class="field">
                  <span>Weer of wind</span>
                  <select name="weather">
                    <option value="notApplicable">Niet van toepassing / binnen</option>
                    <option value="safe">Buiten, omstandigheden veilig</option>
                    <option value="unsafe">Buiten, omstandigheden onveilig</option>
                  </select>
                </label>
                <label class="field">
                  <span>Verkeer en publiek afgeschermd?</span>
                  <select name="segregated">
                    <option value="unknown">Nog controleren</option>
                    <option value="yes">Ja, afgeschermd</option>
                    <option value="no">Nee</option>
                  </select>
                </label>
                <label class="field">
                  <span>Elektrisch risico beheerst?</span>
                  <select name="electricalControl">
                    <option value="unknown">Nog controleren</option>
                    <option value="yes">Ja, aantoonbaar beheerst</option>
                    <option value="no">Nee</option>
                  </select>
                </label>
              </div>
            </section>

            <section class="panel" data-panel="3" aria-labelledby="panel-three-title" hidden>
              <h3 id="panel-three-title" tabindex="-1">Wat is beschikbaar en geregeld?</h3>
              <fieldset class="choice-block">
                <legend>Beschikbare arbeidsmiddelen en voorzieningen</legend>
                <p class="help">Vink alleen middelen aan die daadwerkelijk op tijd beschikbaar zijn.</p>
                <div class="checks grid">
                  <label><input type="checkbox" name="equipment" value="permanentPlatform"> Vast bordes / werkvloer</label>
                  <label><input type="checkbox" name="equipment" value="edgeProtection"> Randbeveiliging</label>
                  <label><input type="checkbox" name="equipment" value="scaffold"> Vaste steiger</label>
                  <label><input type="checkbox" name="equipment" value="rollingScaffold"> Rolsteiger</label>
                  <label><input type="checkbox" name="equipment" value="scissorLift"> Schaarhoogwerker</label>
                  <label><input type="checkbox" name="equipment" value="boomLift"> Knik-/telescoophoogwerker</label>
                  <label><input type="checkbox" name="equipment" value="podiumStep"> Bordestrap</label>
                  <label><input type="checkbox" name="equipment" value="ladder"> Ladder of trap</label>
                  <label><input type="checkbox" name="equipment" value="fallProtection"> Valbeveiliging / ankerpunt</label>
                </div>
              </fieldset>
              <div class="fields two-columns">
                <label class="field">
                  <span>Keuring en controle van middelen</span>
                  <select name="inspectionStatus">
                    <option value="unknown">Nog controleren</option>
                    <option value="yes">Aantoonbaar in orde</option>
                    <option value="no">Niet in orde / verlopen</option>
                  </select>
                </label>
                <label class="field">
                  <span>Medewerker geïnstrueerd en bekwaam?</span>
                  <select name="generalCompetence">
                    <option value="unknown">Nog controleren</option>
                    <option value="yes">Ja</option>
                    <option value="no">Nee</option>
                  </select>
                </label>
                <label class="field">
                  <span>Bediening hoogwerker geregeld?</span>
                  <select name="liftCompetence">
                    <option value="notApplicable">Niet van toepassing</option>
                    <option value="yes">Ja, geïnstrueerde bediener</option>
                    <option value="no">Nee</option>
                    <option value="unknown">Nog controleren</option>
                  </select>
                </label>
                <label class="field">
                  <span>Reddingsplan bij valbeveiliging</span>
                  <select name="rescuePlan">
                    <option value="notApplicable">Niet van toepassing</option>
                    <option value="yes">Aanwezig en besproken</option>
                    <option value="no">Niet aanwezig</option>
                    <option value="unknown">Nog controleren</option>
                  </select>
                </label>
                <label class="field">
                  <span>Verantwoordelijke controleert voor start?</span>
                  <select name="supervision">
                    <option value="unknown">Nog vastleggen</option>
                    <option value="yes">Ja</option>
                    <option value="no">Nee</option>
                  </select>
                </label>
                <label class="field">
                  <span>Rol verantwoordelijke</span>
                  <input name="responsibleRole" type="text" maxlength="80" placeholder="Bijvoorbeeld: uitvoerder">
                </label>
                <label class="field wide">
                  <span>Aanvullende toelichting</span>
                  <textarea name="notes" rows="3" maxlength="500" placeholder="Bijvoorbeeld: toegang via smalle doorgang"></textarea>
                </label>
              </div>
            </section>

            <section class="panel result-panel" data-panel="4" aria-labelledby="result-title" hidden>
              <div class="result-empty" id="result-empty">
                <h3 id="result-title" tabindex="-1">Advies</h3>
                <p>Vul de stappen in en kies <strong>Maak advies</strong>.</p>
              </div>
              <div id="result" hidden aria-live="polite">
                <div class="result-header">
                  <span class="badge" id="risk-badge"></span>
                  <p class="result-task" id="result-task"></p>
                  <h3 id="recommendation" tabindex="-1"></h3>
                  <p class="result-explanation" id="result-explanation"></p>
                </div>
                <section class="stop-box" id="stop-box" hidden>
                  <h4>Niet starten voordat dit is opgelost</h4>
                  <ul id="stop-list"></ul>
                </section>
                <div class="result-columns">
                  <section>
                    <h4>Waarom dit advies?</h4>
                    <ul id="reason-list"></ul>
                  </section>
                  <section>
                    <h4>Maatregelen</h4>
                    <ul id="measure-list"></ul>
                  </section>
                  <section>
                    <h4>Controle voor de start</h4>
                    <ul id="check-list"></ul>
                  </section>
                  <section>
                    <h4>Let op bij alternatieven</h4>
                    <ul id="reject-list"></ul>
                  </section>
                </div>

                <section class="ai-card" aria-labelledby="ai-title">
                  <div class="ai-heading">
                    <div>
                      <p class="eyebrow">AI-advies</p>
                      <h4 id="ai-title">Maak het advies praktisch voor jouw klus</h4>
                    </div>
                    <span class="ai-status" id="ai-status">AI controleren...</span>
                  </div>
                  <p class="help">
                    AI werkt op basis van het gecontroleerde veiligheidsadvies en mag
                    stopmeldingen niet versoepelen. Bij gebruik worden de ingevulde klusgegevens
                    en je vraag naar de AI-dienst gestuurd. Vul geen persoonsgegevens in.
                  </p>
                  <label class="field">
                    <span>Wat wil je weten?</span>
                    <textarea id="ai-question" rows="2" maxlength="800">Leg uit waarom dit arbeidsmiddel passend is en wat ik voor de start moet regelen.</textarea>
                  </label>
                  <label class="field ai-access" id="ai-access" hidden>
                    <span>Toegangscode voor AI</span>
                    <input id="ai-access-code" type="password" autocomplete="one-time-code" maxlength="100" placeholder="Vul de gedeelde code in">
                    <small>Deze code voorkomt ongewenst gebruik van het AI-budget.</small>
                  </label>
                  <button class="primary" id="ask-ai" type="button">Maak AI-advies</button>
                  <div class="ai-answer" id="ai-answer" hidden aria-live="polite"></div>
                </section>

                <p class="disclaimer" id="disclaimer"></p>
                <div class="report-actions">
                  <button class="primary" id="save-report" type="button">Bewaar beoordeling</button>
                  <button class="secondary" id="download-report" type="button">Download verslag</button>
                  <button class="secondary" id="print-report" type="button">Afdrukken / PDF</button>
                  <button class="secondary" id="share-report" type="button">Deel samenvatting</button>
                </div>
              </div>
            </section>

            <div class="form-actions" id="form-actions">
              <button class="secondary" type="button" id="previous-step" hidden>Vorige</button>
              <button class="primary" type="button" id="next-step">Volgende</button>
              <button class="primary" type="submit" id="generate" hidden>Maak advies</button>
            </div>
          </form>
        </section>

        <aside class="saved card" id="saved-panel" hidden aria-labelledby="saved-title">
          <div class="card-head">
            <div>
              <p class="eyebrow">Op dit apparaat</p>
              <h2 id="saved-title" tabindex="-1">Bewaarde beoordelingen</h2>
            </div>
            <button class="text-button" id="saved-close" type="button">Sluiten</button>
          </div>
          <p class="help">Gegevens blijven alleen in deze browser staan, tenzij je een verslag deelt.</p>
          <div class="saved-list" id="saved-list"></div>
        </aside>
      </div>

      <section class="about card" aria-labelledby="about-title">
        <div>
          <p class="eyebrow">Over de methode</p>
          <h2 id="about-title">Een keuze die uitlegbaar blijft</h2>
        </div>
        <p>
          De beslisregels geven voorrang aan voorkomen van hoogtewerk en collectieve
          maatregelen. AI vertaalt het gecontroleerde resultaat naar begrijpelijke,
          taakgerichte uitleg en vervolgstappen.
        </p>
        <div class="sources">
          <a href="https://www.arboportaal.nl/onderwerpen/inrichting-werkvloer/werken-op-hoogte" target="_blank" rel="noreferrer">Arboportaal: werken op hoogte</a>
          <a href="https://www.arboportaal.nl/onderwerpen/inrichting-werkvloer/werken-op-hoogte/wat-zegt-de-wet-over-werken-op-hoogte" target="_blank" rel="noreferrer">Wettelijke uitgangspunten</a>
          <a href="https://www.nlarbeidsinspectie.nl/onderwerpen/arbeidsomstandighedenwet/rolsteigers" target="_blank" rel="noreferrer">Arbeidsinspectie: rolsteigers</a>
        </div>
      </section>
    </main>

    <footer>
      <p><strong>HoogteWijzer</strong> | Beslisondersteuning voor veilig werken op hoogte</p>
      <p>Controleer regels, arbocatalogus en bedrijfsafspraken voordat de app in de praktijk wordt ingezet.</p>
    </footer>
    <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
  </body>
</html>
