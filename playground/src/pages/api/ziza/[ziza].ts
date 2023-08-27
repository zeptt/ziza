import { gmailSmtpTransporterAdapter } from "./../../../../../src";
import { createTemplate } from "./../../../../../src";
import { createEmailApiHandler, createTransporter } from "../../../../../src";
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
});

export default createEmailApiHandler(
  template,
  createTransporter({
    auth: {
      from: "geoffreyantoignatius@gmail.com",
      password: process.env.GMAIL_PASSWORD as string,
    },
    smtpTransporter: gmailSmtpTransporterAdapter,
  })
);
