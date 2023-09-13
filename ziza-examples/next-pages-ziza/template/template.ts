import { createTemplate } from "ziza/template";
import { z } from "zod";

export const template = createTemplate({
  bills: {
    data: {
      price: z.number(),
      noOfItems: z.number(),
    },
    html: `
        <div>
          <h1>Welcome !</h1>
          <p>You bought {{noOfItems}} Cars of {{price}}$.</p>
         </div>
      `,
    defaults: {
      subject: "Your bill!",
    },
  },
  welcome: {
    data: {
      name: z.string(),
      email: z.string(),
    },
    html: `
        <div>
        <h1>Welcome {{name}} {{email}}!</h1>
        <p>Thank you for registering with us.</p>
        </div>
      `,
  },
});
