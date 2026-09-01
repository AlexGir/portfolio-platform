const test = require("node:test");
const assert = require("node:assert");
const { greet } = require("./greet");

test("greets a named person", () => {
  assert.strictEqual(greet("Alex"), "Hello, Alex!");
});
