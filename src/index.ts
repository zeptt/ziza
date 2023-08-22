import { POST } from "./server";

export const Hello = (s: string) => {
  if (!s) {
    throw new Error("No name provided");
  }
  return `Hello ${s}!`;
};

export { POST };
