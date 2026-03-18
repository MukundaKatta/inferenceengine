import { describe, it, expect } from "vitest";
import { Inferenceengine } from "../src/core.js";
describe("Inferenceengine", () => {
  it("init", () => { expect(new Inferenceengine().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Inferenceengine(); await c.manage(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Inferenceengine(); await c.manage(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
