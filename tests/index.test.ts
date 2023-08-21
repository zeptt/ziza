import { Hello } from "../src/index";
import { describe, expect, it } from "vitest";

describe("index", () => {
  it("should pass", () => {
    expect(Hello("World")).toBe("Hello World!");
  });

  it("should pass", () => {
    expect(Hello("Geo")).toBe("Hello Geo!");
  });

  it("should fail", () => {
    // @ts-ignore
    expect(() => Hello()).toThrow("No name provided");
  });
});
