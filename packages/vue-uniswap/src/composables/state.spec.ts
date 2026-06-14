import { describe, it, expect } from "vitest";
import { isReactive } from "vue";
import { createWidgetState } from "./state";

describe("createWidgetState", () => {
  it("returns a reactive object with sensible defaults", () => {
    const s = createWidgetState();
    expect(isReactive(s)).toBe(true);
    expect(s.inputAmount).toBe("");
    expect(s.outputAmount).toBe("");
    expect(s.inputToken).toBeNull();
    expect(s.outputToken).toBeNull();
    expect(s.loading).toBe(false);
    expect(s.error).toBeNull();
  });
});
