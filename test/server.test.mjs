import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createAppServer } from "../server.mjs";

let server;
let baseUrl;
let originalApiKey;

before(async () => {
  originalApiKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  server = createAppServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalApiKey;
});

test("de app en statusfunctie worden aangeboden", async () => {
  const page = await fetch(`${baseUrl}/`);
  const status = await fetch(`${baseUrl}/api/status`).then((response) => response.json());

  assert.equal(page.status, 200);
  assert.match(await page.text(), /HoogteWijzer/);
  assert.equal(status.aiConfigured, false);
});

test("AI-vraag gebruikt zonder sleutel een veilig basisadvies", async () => {
  const response = await fetch(`${baseUrl}/api/ai-advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenario: {
        taskName: "Schilderwerk",
        fallHeight: "4",
        avoidHeight: "no",
        duration: "halfDay",
        twoHands: true,
        surface: "unstable",
        equipment: ["ladder"]
      },
      question: "Kan ik toch beginnen?"
    })
  });
  const answer = await response.json();

  assert.equal(response.status, 200);
  assert.equal(answer.mode, "basis");
  assert.equal(answer.result.status, "stop");
  assert.match(answer.content, /Start het werk nog niet/);
});

test("AI-vraag gebruikt de Responses API wanneer een sleutel is ingesteld", async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  const originalFetch = globalThis.fetch;
  process.env.OPENAI_API_KEY = "test-key";
  let requestBody;

  globalThis.fetch = async (input, init) => {
    if (String(input) === "https://api.openai.com/v1/responses") {
      requestBody = JSON.parse(String(init.body));
      return new Response(JSON.stringify({ output_text: "Advies\nGebruik de steiger volgens het basisadvies." }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return originalFetch(input, init);
  };

  try {
    const response = await originalFetch(`${baseUrl}/api/ai-advice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario: {
          taskName: "Schilderwerk",
          fallHeight: "4",
          avoidHeight: "no",
          duration: "halfDay",
          twoHands: true,
          surface: "stable",
          space: "ample",
          equipment: ["scaffold"]
        },
        question: "Wat moet ik regelen?"
      })
    });
    const answer = await response.json();

    assert.equal(answer.mode, "ai");
    assert.match(answer.content, /steiger/);
    assert.equal(typeof requestBody.model, "string");
    assert.match(requestBody.instructions, /harde grenzen/);
    assert.match(requestBody.input, /Schilderwerk/);
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
    globalThis.fetch = originalFetch;
  }
});

test("een ingestelde AI-toegangscode beschermt het advies", async () => {
  const previousCode = process.env.AI_ACCESS_CODE;
  process.env.AI_ACCESS_CODE = "deelcode";

  try {
    const denied = await fetch(`${baseUrl}/api/ai-advice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: { taskName: "Test" }, question: "Advies?" })
    });
    const permitted = await fetch(`${baseUrl}/api/ai-advice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AI-Access-Code": "deelcode"
      },
      body: JSON.stringify({ scenario: { taskName: "Test" }, question: "Advies?" })
    });

    assert.equal(denied.status, 401);
    assert.equal(permitted.status, 200);
  } finally {
    if (previousCode === undefined) delete process.env.AI_ACCESS_CODE;
    else process.env.AI_ACCESS_CODE = previousCode;
  }
});
