import { z } from "zod";

export const template = {
  bills: {
    data: {
      price: z.number(),
      noOfItems: z.number(),
    },
    html: "",
  },
  welcome: {
    data: {
      name: z.string(),
      email: z.string().email(),
    },
    html: `
      <div>
        <h1>Welcome {{name}} {{email}}!</h1>
        <p>Thank you for registering with us.</p>
      </div>
    `,
  },
};
