import { z } from "zod";

//! These values will override the ones in the template defined above
//! TODO: Change this to the final email client options once we finalize
export const emailOptionsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  subject: z.string().optional(),
  attachments: z.array(z.object({})).optional(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  replyTo: z.string().optional(),
  inReplyTo: z.string().optional(),
  references: z.string().optional(),
});

export const createTemplate = <
  T extends Record<
    string,
    { data: Record<string, z.Schema>; html: string } & {
      defaults?: z.infer<typeof emailOptionsSchema>;
    }
  >
>(
  template: T
) => {
  return template;
};

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
