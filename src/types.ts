import { z } from "zod";

const HeadersSchema = z.union([
  z.record(
    z.union([
      z.string(),
      z.array(z.string()),
      z.object({ prepared: z.boolean(), value: z.string() }),
    ])
  ),
  z.array(z.object({ key: z.string(), value: z.string() })),
]);

const AttachmentLikeSchema = z.object({
  content: z.union([z.string(), z.instanceof(Buffer)]).optional(),
  path: z.string().optional(),
});

const AttachmentSchema = AttachmentLikeSchema.merge(
  z.object({
    filename: z.union([z.string(), z.literal(false)]).optional(),
    cid: z.string().optional(),
    encoding: z.string().optional(),
    contentType: z.string().optional(),
    contentTransferEncoding: z
      .union([
        z.literal("7bit"),
        z.literal("base64"),
        z.literal("quoted-printable"),
        z.literal(false),
      ])
      .optional(),
    contentDisposition: z
      .union([z.literal("attachment"), z.literal("inline")])
      .optional(),
    headers: HeadersSchema.optional(),
    raw: z
      .union([z.string(), z.instanceof(Buffer), AttachmentLikeSchema])
      .optional(),
  })
);

export const EmailOptionsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  subject: z.string().optional(),
  attachments: z.array(AttachmentSchema).optional(),
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
