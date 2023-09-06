import { EmailOptionsSchema, templateSchema } from "./types";
import { z } from "zod";

export const createTemplate = <
  T extends Record<
    string,
    { data: Record<string, z.ZodNumber | z.ZodString>; html: string } & {
      defaults?: z.infer<typeof EmailOptionsSchema>;
    }
  >
>(
  template: T
) => {
  const isValidTemplate = templateSchema.safeParse(template);
  if (!isValidTemplate.success) {
    throw new Error("Invalid template");
  }
  return template;
};
