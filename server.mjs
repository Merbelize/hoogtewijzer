import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { assessScenario, buildFallbackAdvice, scenarioForPrompt } from "./public/modules/engine.js";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "public");
const port = Number.parseInt(process.env.PORT || "4173", 10);
const host = process.env.HOST || (process.env.RENDER ? "0.0.0.0" : "127.0.0.1");
const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const aiLimitWindowMs = 10 * 60 * 1000;
const aiLimitMax = 12;
const aiUsage = new Map();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'self'; form-action 'self'; connect-src 'self'; font-src 'self'; img-src 'self' data:; manifest-src 'self'; script-src 'self'; style-src 'self'; worker-src 'self'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

function sendJson(response, status, value) {
  response.writeHead(status, {
    ...securityHeaders,
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(value));
}

function safeQuestion(value) {
  if (typeof value !== "string") return "Leg het advies kort uit.";
  return value.trim().slice(0, 800) || "Leg het advies kort uit.";
}

function accessCodeIsValid(request) {
  const expected = process.env.AI_ACCESS_CODE;
  if (!expected) return true;
  const supplied = request.headers["x-ai-access-code"];
  if (typeof supplied !== "string") return false;
  const suppliedBytes = Buffer.from(supplied);
  const expectedBytes = Buffer.from(expected);
  return (
    suppliedBytes.length === expectedBytes.length &&
    timingSafeEqual(suppliedBytes, expectedBytes)
  );
}

function aiRequestAllowed(request) {
  const now = Date.now();
  const forwarded = String(request.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const address = forwarded || request.socket.remoteAddress || "onbekend";
  const recent = (aiUsage.get(address) || []).filter((timestamp) => now - timestamp < aiLimitWindowMs);
  if (recent.length >= aiLimitMax) {
    aiUsage.set(address, recent);
    return false;
  }
  recent.push(now);
  aiUsage.set(address, recent);
  return true;
}

async function readJsonBody(request) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > 100_000) {
      throw new Error("De invoer is te groot.");
    }
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function extractText(apiResponse) {
  if (typeof apiResponse.output_text === "string" && apiResponse.output_text.trim()) {
    return apiResponse.output_text.trim();
  }
  const output = Array.isArray(apiResponse.output) ? apiResponse.output : [];
  return output
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .filter((content) => content.type === "output_text" && typeof content.text === "string")
    .map((content) => content.text.trim())
    .filter(Boolean)
    .join("\n\n");
}

async function requestAiExplanation(result, question) {
  const fallback = buildFallbackAdvice(result);
  if (!process.env.OPENAI_API_KEY) {
    return {
      mode: "basis",
      content: fallback,
      notice:
        "AI is nog niet geactiveerd op de server. Stel OPENAI_API_KEY in; hieronder staat voorlopig het gecontroleerde basisadvies."
    };
  }

  const instructions = [
    "Je bent de Nederlandse AI-coach van HoogteWijzer voor operationele medewerkers die op hoogte moeten werken.",
    "Schrijf in gewone spreektaal, in jij-vorm, kort en motiverend. Gebruik maximaal 150 woorden.",
    "Gebruik korte zinnen en de kopjes: Kies dit, Waarom, Eerst regelen.",
    "Het gecontroleerde basisadvies en eventuele stopredenen zijn harde grenzen.",
    "Bij een stopadvies begin je met: Start nog niet.",
    "Maak een stopadvies nooit minder streng, geef geen toestemming om te starten bij een blokkade en adviseer nooit een onveiliger middel.",
    "Noem maximaal drie acties die de medewerker nu moet doen.",
    "Sluit positief af, bijvoorbeeld: Zo werk je rustiger en veiliger."
  ].join(" ");

  const input = [
    "Gecontroleerd resultaat uit de beslisregels:",
    JSON.stringify(scenarioForPrompt(result), null, 2),
    "",
    `Vraag van de gebruiker: ${question}`
  ].join("\n");

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        max_output_tokens: 550
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI gaf status ${aiResponse.status}.`);
    }
    const data = await aiResponse.json();
    const content = extractText(data);
    if (!content) {
      throw new Error("De AI gaf geen leesbare toelichting terug.");
    }
    return { mode: "ai", content, model };
  } catch {
    return {
      mode: "basis",
      content: fallback,
      notice: "AI is nu niet bereikbaar. Hieronder staat het gecontroleerde basisadvies."
    };
  }
}

async function handleApi(request, response, pathname) {
  if (pathname === "/api/status" && request.method === "GET") {
    sendJson(response, 200, {
      aiConfigured: Boolean(process.env.OPENAI_API_KEY),
      accessRequired: Boolean(process.env.AI_ACCESS_CODE),
      model: process.env.OPENAI_API_KEY ? model : null
    });
    return true;
  }

  if (pathname === "/api/ai-advice" && request.method === "POST") {
    try {
      if (process.env.RENDER && process.env.OPENAI_API_KEY && !process.env.AI_ACCESS_CODE) {
        sendJson(response, 503, {
          error: "AI is nog niet vrijgegeven. Stel eerst een toegangscode in."
        });
        return true;
      }
      if (!accessCodeIsValid(request)) {
        sendJson(response, 401, { error: "De toegangscode voor AI is niet juist." });
        return true;
      }
      if (process.env.OPENAI_API_KEY && !aiRequestAllowed(request)) {
        sendJson(response, 429, {
          error: "Er zijn te veel AI-vragen kort na elkaar. Probeer het later opnieuw."
        });
        return true;
      }
      const body = await readJsonBody(request);
      const result = assessScenario(body.scenario || {});
      const explanation = await requestAiExplanation(result, safeQuestion(body.question));
      sendJson(response, 200, { ...explanation, result });
    } catch (error) {
      sendJson(response, 400, {
        error: error instanceof Error ? error.message : "De invoer kon niet worden verwerkt."
      });
    }
    return true;
  }

  if (pathname.startsWith("/api/")) {
    sendJson(response, 404, { error: "Deze functie bestaat niet." });
    return true;
  }
  return false;
}

async function serveFile(response, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const cleaned = normalize(decodeURIComponent(requested)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, cleaned);
  if (!filePath.startsWith(`${publicDir}${sep}`) && filePath !== join(publicDir, "index.html")) {
    sendJson(response, 403, { error: "Niet toegestaan." });
    return;
  }

  try {
    const details = await stat(filePath);
    if (!details.isFile()) throw new Error("Geen bestand");
    const contents = await readFile(filePath);
    const noCache = requested === "/index.html" || requested === "/sw.js";
    response.writeHead(200, {
      ...securityHeaders,
      "Cache-Control": noCache ? "no-cache" : "public, max-age=3600",
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream"
    });
    response.end(contents);
  } catch {
    const contents = await readFile(join(publicDir, "index.html"));
    response.writeHead(200, {
      ...securityHeaders,
      "Cache-Control": "no-cache",
      "Content-Type": mimeTypes[".html"]
    });
    response.end(contents);
  }
}

export function createAppServer() {
  return createServer(async (request, response) => {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    if (await handleApi(request, response, url.pathname)) return;
    if (request.method !== "GET" && request.method !== "HEAD") {
      sendJson(response, 405, { error: "Methode niet toegestaan." });
      return;
    }
    await serveFile(response, url.pathname);
  });
}

const launchedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (launchedDirectly) {
  createAppServer().listen(port, host, () => {
    console.log(`HoogteWijzer is beschikbaar op http://${host}:${port}`);
    console.log(
      process.env.OPENAI_API_KEY
        ? `AI-advies is actief met ${model}${process.env.AI_ACCESS_CODE ? " en toegangscode." : "."}`
        : "AI-advies wordt actief zodra OPENAI_API_KEY op de server is ingesteld."
    );
  });
}
