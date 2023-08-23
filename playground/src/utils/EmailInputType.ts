declare namespace DKIM {
  interface OptionalOptions {
    cacheDir?: string | false | undefined;
    cacheTreshold?: number | undefined;
    hashAlgo?: string | undefined;
    headerFieldNames?: string | undefined;
    skipFields?: string | undefined;
  }

  interface SingleKeyOptions extends OptionalOptions {
    domainName: string;
    keySelector: string;
    privateKey: string | { key: string; passphrase: string };
  }

  interface MultipleKeysOptions extends OptionalOptions {
    keys: SingleKeyOptions[];
  }

  type Options = SingleKeyOptions | MultipleKeysOptions;
}

export declare namespace Mail {
  type Headers =
    | {
        [key: string]: string | string[] | { prepared: boolean; value: string };
      }
    | Array<{ key: string; value: string }>;

  type ListHeader = string | { url: string; comment: string };

  interface ListHeaders {
    [key: string]: ListHeader | ListHeader[] | ListHeader[][];
  }

  type TextEncoding = "quoted-printable" | "base64";

  interface Address {
    name: string;
    address: string;
  }

  interface AttachmentLike {
    content?: string | Buffer | undefined;
    path?: string | undefined;
  }

  interface Attachment extends AttachmentLike {
    filename?: string | false | undefined;
    cid?: string | undefined;
    encoding?: string | undefined;
    contentType?: string | undefined;
    contentTransferEncoding?:
      | "7bit"
      | "base64"
      | "quoted-printable"
      | false
      | undefined;
    contentDisposition?: "attachment" | "inline" | undefined;
    headers?: Headers | undefined;
    raw?: string | Buffer | AttachmentLike | undefined;
  }

  interface AmpAttachment extends AttachmentLike {
    href?: string | undefined;
    encoding?: string | undefined;
    contentType?: string | undefined;
    raw?: string | Buffer | AttachmentLike | undefined;
  }

  interface IcalAttachment extends AttachmentLike {
    method?: string | undefined;
    filename?: string | false | undefined;
    href?: string | undefined;
    encoding?: string | undefined;
  }

  interface Envelope {
    from?: string | undefined;
    to?: string | undefined;
    cc?: string | undefined;
    bcc?: string | undefined;
  }

  interface Options {
    from?: string | Address | undefined;
    sender?: string | Address | undefined;
    to?: string | Address | Array<string | Address> | undefined;
    cc?: string | Address | Array<string | Address> | undefined;
    bcc?: string | Address | Array<string | Address> | undefined;
    replyTo?: string | Address | Array<string | Address> | undefined;
    inReplyTo?: string | Address | undefined;
    references?: string | string[] | undefined;
    subject?: string | undefined;
    text?: string | Buffer | AttachmentLike | undefined;
    html?: string | Buffer | AttachmentLike | undefined;
    watchHtml?: string | Buffer | AttachmentLike | undefined;
    amp?: string | Buffer | AmpAttachment | undefined;
    icalEvent?: string | Buffer | IcalAttachment | undefined;
    headers?: Headers | undefined;
    list?: ListHeaders | undefined;
    attachments?: Attachment[] | undefined;
    alternatives?: Attachment[] | undefined;
    envelope?: Envelope | undefined;
    messageId?: string | undefined;
    date?: Date | string | undefined;
    encoding?: string | undefined;
    raw?: string | Buffer | AttachmentLike | undefined;
    textEncoding?: TextEncoding | undefined;
    disableUrlAccess?: boolean | undefined;
    disableFileAccess?: boolean | undefined;
    dkim?: DKIM.Options | undefined;
    normalizeHeaderKey?(key: string): string;
    priority?: "high" | "normal" | "low" | undefined;
    attachDataUrls?: boolean | undefined;
    data: Record<string, unknown>;
  }
}

// --------------------------------------------- ZOD SCHEMAS ---------------------------------------------

import { z } from "zod";

// DKIM namespace
const OptionalOptionsSchema = z.object({
  cacheDir: z.union([z.string(), z.literal(false)]).optional(),
  cacheTreshold: z.number().optional(),
  hashAlgo: z.string().optional(),
  headerFieldNames: z.string().optional(),
  skipFields: z.string().optional(),
});

const SingleKeyOptionsSchema = OptionalOptionsSchema.merge(
  z.object({
    domainName: z.string(),
    keySelector: z.string(),
    privateKey: z.union([
      z.string(),
      z.object({ key: z.string(), passphrase: z.string() }),
    ]),
  })
);

const MultipleKeysOptionsSchema = OptionalOptionsSchema.merge(
  z.object({
    keys: z.array(SingleKeyOptionsSchema),
  })
);

const OptionsSchema = z.union([
  SingleKeyOptionsSchema,
  MultipleKeysOptionsSchema,
]);

// Mail namespace
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

const ListHeaderSchema = z.union([
  z.string(),
  z.object({ url: z.string(), comment: z.string() }),
]);

const ListHeadersSchema = z.record(
  z.union([
    ListHeaderSchema,
    z.array(ListHeaderSchema),
    z.array(z.array(ListHeaderSchema)),
  ])
);

const AddressSchema = z.object({
  name: z.string(),
  address: z.string(),
});

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

const AmpAttachmentSchema = AttachmentLikeSchema.merge(
  z.object({
    href: z.string().optional(),
    encoding: z.string().optional(),
    contentType: z.string().optional(),
    raw: z
      .union([z.string(), z.instanceof(Buffer), AttachmentLikeSchema])
      .optional(),
  })
);

const IcalAttachmentSchema = AttachmentLikeSchema.merge(
  z.object({
    method: z.string().optional(),
    filename: z.union([z.string(), z.literal(false)]).optional(),
    href: z.string().optional(),
    encoding: z.string().optional(),
  })
);

const EnvelopeSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
});

const MailOptionsSchema = z.object({
  from: z.union([z.string(), AddressSchema]).optional(),
  sender: z.union([z.string(), AddressSchema]).optional(),
  to: z
    .union([
      z.string(),
      AddressSchema,
      z.array(z.union([z.string(), AddressSchema])),
    ])
    .optional(),
  cc: z
    .union([
      z.string(),
      AddressSchema,
      z.array(z.union([z.string(), AddressSchema])),
    ])
    .optional(),
  bcc: z
    .union([
      z.string(),
      AddressSchema,
      z.array(z.union([z.string(), AddressSchema])),
    ])
    .optional(),
  replyTo: z
    .union([
      z.string(),
      AddressSchema,
      z.array(z.union([z.string(), AddressSchema])),
    ])
    .optional(),
  inReplyTo: z.string().optional(),
  references: z.union([z.string(), z.array(z.string())]).optional(),
  subject: z.string().optional(),
  text: z
    .union([z.string(), z.instanceof(Buffer), AttachmentLikeSchema])
    .optional(),
  html: z
    .union([z.string(), z.instanceof(Buffer), AttachmentLikeSchema])
    .optional(),
  watchHtml: z
    .union([z.string(), z.instanceof(Buffer), AttachmentLikeSchema])
    .optional(),
  amp: z
    .union([z.string(), z.instanceof(Buffer), AmpAttachmentSchema])
    .optional(),
  icalEvent: z
    .union([z.string(), z.instanceof(Buffer), IcalAttachmentSchema])
    .optional(),
  headers: HeadersSchema.optional(),
  list: ListHeadersSchema.optional(),
  attachments: z.array(AttachmentSchema).optional(),
  alternatives: z.array(AttachmentSchema).optional(),
  envelope: EnvelopeSchema.optional(),
  messageId: z.string().optional(),
  date: z.union([z.string(), z.instanceof(Date)]).optional(),
  encoding: z.string().optional(),
  raw: z
    .union([z.string(), z.instanceof(Buffer), AttachmentLikeSchema])
    .optional(),
  textEncoding: z
    .union([z.literal("quoted-printable"), z.literal("base64")])
    .optional(),
  disableUrlAccess: z.boolean().optional(),
  disableFileAccess: z.boolean().optional(),
  dkim: OptionsSchema.optional(),
  priority: z
    .union([z.literal("high"), z.literal("normal"), z.literal("low")])
    .optional(),
  attachDataUrls: z.boolean().optional(),
  data: z.record(z.unknown()),
});

export { MailOptionsSchema };

// TODO Zod Idea Works
