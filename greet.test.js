const test = require("node:test");
const assert = require("node:assert");
const { greet } = require("./greet");

test("greets a named person", () => {
  assert.strictEqual(greet("Alex"), "Hello, Alex!");
});

test("falls back to a generic greeting when no name is given", () => {
  assert.strictEqual(greet(""), "Hello, world!");
  assert.strictEqual(greet(), "Hello, world!");
});
