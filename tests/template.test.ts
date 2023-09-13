import { z } from "zod";
import { createTemplate } from "../internal/template";
import { describe, expect, it } from "vitest";

describe("template", () => {
  const mockTemplates = [
    {
      value: {
        welcome: {
          data: {},
          html: "<div></div>",
          defaults: {},
        },
        bill: {
          data: {},
          html: "<div></div>",
          defaults: {},
        },
      },
      shouldPass: true,
    },
    {
      value: {
        welcome: {
          data: {},
          html: "<div></div>",
          defaults: {},
        },
        bill: {
          data: {},
          html: "<div></div>",
        },
      },
      shouldPass: true,
    },
    {
      value: {
        welcome: {
          data: {},
          defaults: {},
        },
        bill: {
          data: {},
          html: "<div></div>",
        },
      },
      shouldPass: false,
    },
    {
      value: {
        welcome: {
          data: {},
          html: "<div></div>",
        },
        bill: {
          html: "<div></div>",
        },
      },
      shouldPass: false,
    },
  ] as any[];
  it("should pass", () => {
    mockTemplates.forEach((data) => {
      if (data.shouldPass) {
        expect(createTemplate(data.value)).toBe(data.value);
      } else {
        try {
          expect(createTemplate(data.value)).toThrow();
        } catch (e: any) {
          expect(e).toBeInstanceOf(Error);
          expect(e.message).toBe("Invalid template");
        }
      }
    });
  });
});
