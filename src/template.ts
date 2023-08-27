import { EmailOptionsSchema } from "types";
import { z } from "zod";

export const createTemplate = <
  T extends Record<
    string,
    { data: Record<string, z.Schema>; html: string } & {
      defaults?: z.infer<typeof EmailOptionsSchema>;
    }
  >
>(
  template: T
) => {
  return template;
};
