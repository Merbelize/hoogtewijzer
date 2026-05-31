export const hazardLabels = {
  openings: "openingen of niet-draagkrachtige delen",
  fragileRoof: "breekbaar dak of kwetsbare ondergrond",
  traffic: "verkeer of intern transport",
  water: "water of verdrinkingsgevaar",
  machinery: "machines of bewegende delen",
  sharpObjects: "uitstekende of scherpe delen",
  publicArea: "publiek of voorbijgangers",
  electricity: "elektrische installatie of leidingen"
};

export const equipmentLabels = {
  permanentPlatform: "vaste werkvloer of bordes met randbeveiliging",
  edgeProtection: "tijdelijke randbeveiliging",
  scaffold: "vaste steiger",
  rollingScaffold: "rolsteiger",
  scissorLift: "schaarhoogwerker",
  boomLift: "knik- of telescoophoogwerker",
  podiumStep: "bordestrap of platformtrap",
  ladder: "ladder of gewone trap",
  fallProtection: "persoonlijke valbeveiliging met geschikt ankerpunt"
};

export const workTypeLabels = {
  inspection: "inspectie of opname",
  maintenance: "onderhoud of reiniging",
  installation: "montage of installatie",
  painting: "schilder- of gevelwerk",
  logistics: "materiaal plaatsen of verplaatsen",
  other: "overig werk"
};

const durationLabels = {
  brief: "korter dan 15 minuten",
  short: "15 tot 60 minuten",
  halfDay: "1 tot 4 uur",
  day: "langer dan 4 uur"
};

const highConsequenceHazards = new Set([
  "openings",
  "fragileRoof",
  "traffic",
  "water",
  "machinery",
  "sharpObjects"
]);

export const emptyScenario = {
  taskName: "",
  location: "",
  assessmentDate: "",
  responsibleRole: "",
  workType: "maintenance",
  fallHeight: "",
  duration: "short",
  frequency: "once",
  avoidHeight: "unknown",
  protectedPlatform: "no",
  twoHands: false,
  forceRequired: false,
  heavyMaterials: false,
  moveOften: false,
  hazards: [],
  surface: "unknown",
  space: "unknown",
  weather: "notApplicable",
  segregated: "unknown",
  electricalControl: "unknown",
  equipment: [],
  inspectionStatus: "unknown",
  generalCompetence: "unknown",
  liftCompetence: "notApplicable",
  rescuePlan: "notApplicable",
  supervision: "unknown",
  notes: ""
};

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function hasEquipment(scenario, item) {
  return scenario.equipment.includes(item);
}

function riskLevelName(level) {
  return {
    limited: "Beheersbaar na controle",
    raised: "Verhoogd risico",
    high: "Hoog risico",
    stop: "Niet starten"
  }[level];
}

function formatHeight(value) {
  return `${Number(value).toLocaleString("nl-NL", { maximumFractionDigits: 2 })} m`;
}

export function normalizeScenario(raw = {}) {
  const height = Number.parseFloat(String(raw.fallHeight).replace(",", "."));
  return {
    ...emptyScenario,
    ...raw,
    taskName: text(raw.taskName),
    location: text(raw.location),
    responsibleRole: text(raw.responsibleRole),
    notes: text(raw.notes),
    fallHeight: Number.isFinite(height) && height >= 0 ? height : 0,
    hazards: Array.isArray(raw.hazards)
      ? raw.hazards.filter((hazard) => Object.hasOwn(hazardLabels, hazard))
      : [],
    equipment: Array.isArray(raw.equipment)
      ? raw.equipment.filter((item) => Object.hasOwn(equipmentLabels, item))
      : [],
    twoHands: Boolean(raw.twoHands),
    forceRequired: Boolean(raw.forceRequired),
    heavyMaterials: Boolean(raw.heavyMaterials),
    moveOften: Boolean(raw.moveOften)
  };
}

function choosePreferredEquipment(scenario, extensiveTask) {
  if (scenario.protectedPlatform === "yes" || hasEquipment(scenario, "permanentPlatform")) {
    return {
      key: "permanentPlatform",
      title: "Gebruik de beveiligde werkvloer of het bordes",
      explanation: "Een stabiele werkplek met randbeveiliging geeft de meeste bescherming tijdens het werk."
    };
  }

  if (scenario.space === "none") {
    return {
      key: "specialist",
      title: "Laat eerst een veilige werkmethode bepalen",
      explanation: "Er is geen opstelruimte opgegeven voor een veilige werkplek of machine."
    };
  }

  if (scenario.moveOften || scenario.space === "limited") {
    return {
      key: hasEquipment(scenario, "boomLift") ? "boomLift" : "boomLift",
      title: "Gebruik bij voorkeur een geschikte hoogwerker",
      explanation: "De werkplek moet worden bereikt of verplaatst zonder dat iemand onveilig hoeft te klimmen of reiken."
    };
  }

  if (extensiveTask) {
    return {
      key: hasEquipment(scenario, "scaffold") ? "scaffold" : "scaffold",
      title: "Gebruik bij voorkeur een steiger of beveiligde werkvloer",
      explanation: "Voor langer werk, krachtuitoefening of materiaal is een ruime stabiele werkplek passend."
    };
  }

  if (hasEquipment(scenario, "scissorLift")) {
    return {
      key: "scissorLift",
      title: "Gebruik bij voorkeur een schaarhoogwerker",
      explanation: "Voor een bereikbare verticale werkplek geeft dit een beveiligd platform met weinig opbouwtijd."
    };
  }

  if (hasEquipment(scenario, "rollingScaffold")) {
    return {
      key: "rollingScaffold",
      title: "Gebruik bij voorkeur een goed opgebouwde rolsteiger",
      explanation: "Voor tijdelijk werk biedt een volledig beveiligd platform een stabiele werkplek."
    };
  }

  return {
    key: "rollingScaffold",
    title: "Regel een beveiligd platform, rolsteiger of passende hoogwerker",
    explanation: "De beschikbare veilige werkplek is nog niet bevestigd. Kies niet automatisch voor een ladder."
  };
}

export function assessScenario(raw) {
  const scenario = normalizeScenario(raw);
  const heightRisk = scenario.fallHeight >= 2.5;
  const consequenceHazards = scenario.hazards.filter((hazard) => highConsequenceHazards.has(hazard));
  const hasFallRisk = scenario.fallHeight > 0 && (heightRisk || consequenceHazards.length > 0);
  const extensiveTask =
    scenario.duration === "halfDay" ||
    scenario.duration === "day" ||
    scenario.twoHands ||
    scenario.forceRequired ||
    scenario.heavyMaterials;
  const lightLadderCandidate =
    scenario.duration === "brief" &&
    !scenario.twoHands &&
    !scenario.forceRequired &&
    !scenario.heavyMaterials &&
    !scenario.moveOften &&
    !heightRisk &&
    consequenceHazards.length === 0 &&
    scenario.surface === "stable" &&
    scenario.weather !== "unsafe";

  const reasons = [];
  const measures = [];
  const checks = [];
  const rejected = [];
  const stops = [];

  if (scenario.fallHeight > 0) {
    reasons.push(`De mogelijke valhoogte is ${formatHeight(scenario.fallHeight)}.`);
  }
  if (heightRisk) {
    reasons.push("Vanaf 2,50 m moeten maatregelen tegen valgevaar worden getroffen.");
  }
  if (consequenceHazards.length > 0) {
    reasons.push(
      `Ook bij een lagere hoogte is extra valgevaar aanwezig door ${consequenceHazards
        .map((hazard) => hazardLabels[hazard])
        .join(", ")}.`
    );
  }
  if (extensiveTask) {
    reasons.push("De taak vraagt om een stabiele werkplek door duur, houding, kracht of materiaalgebruik.");
  }

  if (scenario.weather === "unsafe") {
    stops.push("Start niet bij onveilig weer of te harde wind; beoordeel opnieuw wanneer de omstandigheden veilig zijn.");
  }
  if (scenario.surface === "unstable") {
    stops.push("De ondergrond is niet stabiel of draagkrachtig genoeg voor veilig gebruik van een arbeidsmiddel.");
  }
  if (scenario.hazards.includes("traffic") && scenario.segregated !== "yes") {
    stops.push("Scheid verkeer of intern transport eerst aantoonbaar van het werkgebied.");
  }
  if (scenario.hazards.includes("electricity") && scenario.electricalControl !== "yes") {
    stops.push("Start niet totdat het elektrische risico aantoonbaar is beheerst, bijvoorbeeld door veilig uitschakelen of veilige afstand.");
  }

  if (scenario.avoidHeight === "yes") {
    measures.push("Voer de handeling beneden uit of gebruik een hulpmiddel vanaf een veilige ondergrond.");
    measures.push("Controleer alsnog risico's bij reiken, vallende voorwerpen en de omgeving.");
    return buildResult({
      scenario,
      status: stops.length ? "stop" : "suitable",
      riskLevel: stops.length ? "stop" : "limited",
      recommendationKey: "ground",
      recommendation: "Voer het werk vanaf de grond uit",
      explanation: "Werk op hoogte voorkomen is de veiligste keuze.",
      reasons,
      measures,
      checks: ["Leg vast hoe werken op hoogte wordt voorkomen.", ...stops],
      rejected: ["Een ladder, steiger of hoogwerker is niet nodig zolang het werk veilig vanaf de grond kan."],
      stops
    });
  }

  if (hasFallRisk && scenario.avoidHeight === "unknown") {
    checks.push("Onderzoek eerst aantoonbaar of het werk beneden of op afstand kan worden uitgevoerd.");
  }

  const preferred = choosePreferredEquipment(scenario, extensiveTask);

  if (scenario.inspectionStatus === "no") {
    stops.push("Gebruik het arbeidsmiddel niet: de keuring of controle is niet in orde.");
  }
  if (scenario.generalCompetence === "no") {
    stops.push("Start niet voordat een geïnstrueerde en bekwame medewerker is aangewezen.");
  }
  if (["boomLift", "scissorLift"].includes(preferred.key) && scenario.liftCompetence === "no") {
    stops.push("Laat de hoogwerker niet gebruiken zonder aantoonbaar geïnstrueerde bediener.");
  }

  if (preferred.key !== "permanentPlatform" && lightLadderCandidate && hasEquipment(scenario, "podiumStep")) {
    rejected.push("Een gewone ladder blijft minder geschikt dan een bordestrap met stabiel platform.");
  } else {
    rejected.push(
      extensiveTask
        ? "Een ladder is niet passend als werkplek voor dit werk: de taak vraagt stabiliteit en bewegingsruimte."
        : "Gebruik een ladder alleen na een aparte beoordeling voor kort en licht werk wanneer een veiliger werkplek niet haalbaar is."
    );
  }

  if (scenario.hazards.includes("fragileRoof") || scenario.hazards.includes("openings")) {
    measures.push("Scherm openingen en niet-draagkrachtige delen af of dek deze deugdelijk af.");
  }
  if (scenario.hazards.includes("publicArea")) {
    measures.push("Zet het gebied onder het werk af en voorkom vallende voorwerpen.");
  }
  if (scenario.hazards.includes("machinery")) {
    measures.push("Stop, scherm af of scheid bewegende machines van het werkgebied.");
  }
  if (scenario.hazards.includes("electricity") && scenario.electricalControl === "yes") {
    measures.push("Borg de afgesproken maatregel tegen elektrisch gevaar tijdens de hele uitvoering.");
  }
  measures.push("Controleer het arbeidsmiddel voor gebruik, inclusief opbouw, stabiliteit en beveiligingen.");
  measures.push("Zorg voor een opgeruimde werkplek en een duidelijke afzetting waar dat nodig is.");

  const requiredItem = equipmentLabels[preferred.key];
  if (requiredItem && !hasEquipment(scenario, preferred.key) && preferred.key !== "permanentPlatform") {
    checks.push(`Het voorkeursmiddel (${requiredItem}) is niet als beschikbaar aangegeven; regel een passend middel voordat het werk start.`);
  }
  if (scenario.inspectionStatus === "unknown") {
    checks.push("Controleer of het gekozen arbeidsmiddel is gekeurd en veilig in gebruik kan worden genomen.");
  }
  if (scenario.generalCompetence === "unknown") {
    checks.push("Wijs een geïnstrueerde en bekwame medewerker aan voor het gekozen werk.");
  }
  if (["boomLift", "scissorLift"].includes(preferred.key) && scenario.liftCompetence === "unknown") {
    checks.push("Laat een aantoonbaar geïnstrueerde en bevoegde bediener de hoogwerker gebruiken.");
  }
  if (scenario.equipment.includes("fallProtection") && scenario.rescuePlan !== "yes") {
    checks.push("Gebruik persoonlijke valbeveiliging niet zonder geschikte ankerpunten, instructie en een reddingsplan.");
  }

  if (preferred.key === "specialist") {
    checks.push("Laat een deskundige een werkmethode bepalen voordat het werk wordt vrijgegeven.");
  }

  const status = stops.length ? "stop" : checks.length ? "attention" : "suitable";
  const riskLevel = stops.length
    ? "stop"
    : heightRisk || consequenceHazards.length > 0 || preferred.key === "specialist"
      ? "high"
      : checks.length
        ? "raised"
        : "limited";

  return buildResult({
    scenario,
    status,
    riskLevel,
    recommendationKey: preferred.key,
    recommendation: preferred.title,
    explanation: preferred.explanation,
    reasons,
    measures,
    checks,
    rejected,
    stops
  });
}

function buildResult({
  scenario,
  status,
  riskLevel,
  recommendationKey,
  recommendation,
  explanation,
  reasons,
  measures,
  checks,
  rejected,
  stops
}) {
  const task = scenario.taskName || workTypeLabels[scenario.workType] || "de werkzaamheden";
  return {
    status,
    riskLevel,
    riskLabel: riskLevelName(riskLevel),
    recommendationKey,
    recommendation,
    explanation,
    reasons: unique(reasons),
    measures: unique(measures),
    checks: unique(checks),
    rejected: unique(rejected),
    stops: unique(stops),
    scenario,
    summary: `${task}: ${recommendation}. ${explanation}`,
    disclaimer:
      "Dit advies ondersteunt de werkvoorbereiding. Het vervangt geen RI&E, LMRA, gebruiksinstructie, keuring of vrijgave door een verantwoordelijke."
  };
}

export function buildFallbackAdvice(result) {
  const opening =
    result.status === "stop"
      ? "Start het werk nog niet. Er zijn voorwaarden die eerst opgelost moeten worden."
      : `Het passende uitgangspunt is: ${result.recommendation.toLowerCase()}.`;
  const why = result.reasons[0] ? ` Belangrijkste reden: ${result.reasons[0]}` : "";
  const action =
    result.checks[0] || result.measures[0]
      ? ` Eerste actie: ${result.checks[0] || result.measures[0]}`
      : "";
  return `${opening}${why}${action} Laat de keuze altijd controleren door de verantwoordelijke voor het werk.`;
}

export function scenarioForPrompt(result) {
  return {
    taak: result.scenario.taskName || workTypeLabels[result.scenario.workType],
    locatie: result.scenario.location || "niet ingevuld",
    valhoogte: formatHeight(result.scenario.fallHeight),
    duur: durationLabels[result.scenario.duration] || result.scenario.duration,
    gevaren: result.scenario.hazards.map((hazard) => hazardLabels[hazard]),
    basisadvies: result.recommendation,
    status: result.riskLabel,
    waarom: result.reasons,
    maatregelen: result.measures,
    voorwaarden: result.checks,
    nietGeschikt: result.rejected,
    stopredenen: result.stops
  };
}
