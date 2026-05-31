import test from "node:test";
import assert from "node:assert/strict";
import { assessScenario, buildFallbackAdvice } from "../engine.js";

test("werk vanaf de grond krijgt voorrang boven een arbeidsmiddel", () => {
  const result = assessScenario({
    taskName: "Armatuur vervangen",
    fallHeight: "4",
    avoidHeight: "yes",
    hazards: ["traffic"]
  });

  assert.equal(result.recommendationKey, "ground");
  assert.match(result.recommendation, /grond/);
});

test("ongecontroleerd verkeer levert een stopadvies op", () => {
  const result = assessScenario({
    fallHeight: "1.8",
    avoidHeight: "no",
    hazards: ["traffic"],
    segregated: "no",
    surface: "stable"
  });

  assert.equal(result.status, "stop");
  assert.equal(result.riskLevel, "stop");
  assert.match(result.stops.join(" "), /Scheid verkeer/);
});

test("langdurig werk met twee handen adviseert geen ladder", () => {
  const result = assessScenario({
    fallHeight: "4",
    avoidHeight: "no",
    duration: "halfDay",
    twoHands: true,
    surface: "stable",
    space: "ample",
    equipment: ["ladder", "scaffold"],
    inspectionStatus: "yes",
    generalCompetence: "yes"
  });

  assert.equal(result.recommendationKey, "scaffold");
  assert.match(result.rejected.join(" "), /ladder/i);
});

test("verplaatsend werk met beperkte ruimte kiest een hoogwerker", () => {
  const result = assessScenario({
    fallHeight: "5",
    avoidHeight: "no",
    duration: "short",
    moveOften: true,
    surface: "stable",
    space: "limited",
    equipment: ["boomLift"],
    inspectionStatus: "yes",
    generalCompetence: "yes",
    liftCompetence: "yes"
  });

  assert.equal(result.recommendationKey, "boomLift");
  assert.match(result.recommendation, /hoogwerker/i);
});

test("standaardtoelichting meldt dat controle nodig blijft", () => {
  const explanation = buildFallbackAdvice(
    assessScenario({ fallHeight: "3", avoidHeight: "unknown" })
  );

  assert.match(explanation, /verantwoordelijke/);
});

test("een afgekeurd arbeidsmiddel verhindert starten", () => {
  const result = assessScenario({
    fallHeight: "3",
    avoidHeight: "no",
    surface: "stable",
    space: "ample",
    equipment: ["scaffold"],
    inspectionStatus: "no",
    generalCompetence: "yes"
  });

  assert.equal(result.status, "stop");
  assert.match(result.stops.join(" "), /keuring/);
});

test("elektrisch gevaar blokkeert starten totdat het is beheerst", () => {
  const blocked = assessScenario({
    fallHeight: "2",
    avoidHeight: "no",
    hazards: ["electricity"],
    electricalControl: "unknown",
    surface: "stable"
  });
  const controlled = assessScenario({
    fallHeight: "2",
    avoidHeight: "no",
    hazards: ["electricity"],
    electricalControl: "yes",
    surface: "stable"
  });

  assert.equal(blocked.status, "stop");
  assert.match(blocked.stops.join(" "), /elektrische risico/);
  assert.notEqual(controlled.status, "stop");
});
