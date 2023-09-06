import { z } from "zod";

export const EmailOptionsSchema = z.object({
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

export type TransporterOpts = {
  from: string;
  password: string;
};

export const ApiBodySchema = z.object({
  data: z.record(z.any()),
  emailOptions: EmailOptionsSchema,
  html: z.string(),
});

export const templateSchema = z.record(
  z.object({
    data: z.record(z.object({})),
    html: z.string(),
    defaults: EmailOptionsSchema.optional(),
  })
);
