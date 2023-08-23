import type { NextApiHandler } from "next";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { template } from "./template";
import * as z from "zod";
import { Mail, MailOptionsSchema } from "./EmailInputType";

const templateSchema = z.object({
  html: z.string(),
  to: z.string(),
  subject: z.string(),
  attachments: z.array(z.object({})),
  data: z.object({}),
});

// type TemplateSchema = z.infer<typeof templateSchema>;
// type tem = keyof TemplateSchema;
// const xc =

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type TransporterOpts = {
  from: string;
  password: string;
};

export const gmailSmtpTransporterAdapter = {
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: true,
};

export const createTransporter = (opts: {
  auth: TransporterOpts;
  smtpTransporter: SMTPTransport.Options;
}) => {
  return nodemailer.createTransport({
    ...opts.smtpTransporter,
    auth: {
      user: opts.auth.from,
      pass: opts.auth.password,
    },
  });
};

function createEmailTemplate(
  templates: Record<string, z.infer<typeof MailOptionsSchema>>
) {
  return templates;
}

export const t = createEmailTemplate({});

export const createEmailApiHandler = <
  TOpts extends Record<string, Mail.Options>,
  TMailTransporter extends nodemailer.Transporter<SMTPTransport.SentMessageInfo>
>(
  templates: TOpts,
  transporter: TMailTransporter
): NextApiHandler => {
  return async (req, res) => {
    const { template_name, data } = req.body;
    // TODO Parse HTML template with the data

    // TODO Validate the data
    // IMPORTANT: This is not working yet hardcode the values to zod
    const k = Object.keys(templateSchema) as (keyof typeof templateSchema)[];

    // TODO Send the email
    transporter.sendMail({
      attachments: [{}],
    });

    const keys = Object.keys(templateSchema);
    res.status(200).json({ message: "Email sent!" });
  };
};
