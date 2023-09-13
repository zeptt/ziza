import { describe, expect, it } from "vitest";
import { ApiBodySchema, EmailOptionsSchema } from "../internal/types";

describe("ApiBodySchema", () => {
  const mockData = [
    {
      value: {
        data: {},
        html: "<div></div>",
        emailOptions: { to: "testing@gmail.com" },
      },
      shouldPass: true,
    },
    { value: { data: {}, emailOptions: {} }, shouldPass: false },
    {
      value: { html: "", emailOptions: { to: "testing@gmail.com" } },
      shouldPass: false,
    },
    {
      value: {
        data: {},
        html: "<div></div>",
      },
      shouldPass: false,
    },
  ] as any[];
  it("should pass", () => {
    mockData.forEach((data) => {
      if (data.shouldPass) {
        expect(ApiBodySchema.safeParse(data.value).success).toBe(true);
      } else {
        expect(ApiBodySchema.safeParse(data.value).success).toBe(false);
      }
    });
  });
});

describe("EmailOptionsSchema", () => {
  const mockData = [
    {
      value: {
        from: "",
        to: "",
      },
      shouldPass: true,
    },
    {
      value: {},
      shouldPass: true,
    },
    {
      value: undefined,
      shouldPass: false,
    },
    {
      value: null,
      shouldPass: false,
    },
  ];
  it("should pass", () => {
    mockData.forEach((data) => {
      if (data.shouldPass) {
        expect(EmailOptionsSchema.safeParse(data.value).success).toBe(true);
      } else {
        expect(EmailOptionsSchema.safeParse(data.value).success).toBe(false);
      }
    });
  });
});
