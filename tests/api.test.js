import { after, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { closeDatabase, resetDatabase } from "../src/database.js";
import {
  createPotion,
  deletePotion,
  listPotions,
} from "../src/potionController.js";

function createMockResponse() {
  return {
    statusCode: 200,
    body: undefined,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    },
  };
}

function failOnNext(error) {
  if (error) {
    throw error;
  }
}

beforeEach(async () => {
  await resetDatabase();
});

after(async () => {
  await closeDatabase();
});

test("GET /api/potions returns seeded potions", async () => {
  const response = createMockResponse();

  await listPotions({}, response, failOnNext);
  const potions = response.body;

  assert.equal(response.statusCode, 200);
  assert.equal(potions.length, 6);
  assert.ok(potions.some((potion) => potion.name === "Poção Blue Sky"));
});

test("POST /api/potions creates a potion", async () => {
  const response = createMockResponse();

  await createPotion(
    {
      body: {
        name: "Poção da Vigília",
        description: "Mantém os olhos abertos por uma longa madrugada inteira.",
        image: "/assets/potions/pocao-blue-sky.png",
        price: 450,
      },
    },
    response,
    failOnNext
  );

  const listResponse = createMockResponse();
  await listPotions({}, listResponse, failOnNext);
  const potions = listResponse.body;

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.name, "Poção da Vigília");
  assert.equal(potions.length, 7);
  assert.equal(potions[0].name, "Poção da Vigília");
});

test("DELETE /api/potions removes a potion", async () => {
  const listResponse = createMockResponse();
  await listPotions({}, listResponse, failOnNext);
  const potions = listResponse.body;
  const targetId = potions[0].id;

  const deleteResponse = createMockResponse();
  await deletePotion(
    {
      params: {
        id: String(targetId),
      },
    },
    deleteResponse,
    failOnNext
  );

  const updatedListResponse = createMockResponse();
  await listPotions({}, updatedListResponse, failOnNext);
  const updatedPotions = updatedListResponse.body;

  assert.equal(deleteResponse.statusCode, 204);
  assert.equal(updatedPotions.length, 5);
  assert.ok(!updatedPotions.some((potion) => potion.id === targetId));
});

test("POST /api/potions validates input", async () => {
  const response = createMockResponse();

  await createPotion(
    {
      body: {
        name: "",
        description: "curta",
        image: "",
        price: 0,
      },
    },
    response,
    failOnNext
  );

  assert.equal(response.statusCode, 400);
  assert.ok(Array.isArray(response.body.errors));
  assert.ok(response.body.errors.length >= 3);
});
