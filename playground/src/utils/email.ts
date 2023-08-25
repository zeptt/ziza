import type { NextApiHandler } from "next";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { template } from "./template";
import * as z from "zod";
import { MailOptions, MailOptionsSchema } from "./EmailInputType";

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

const parseTemplateHTMLWithData = <T extends Record<string, any>>(
  template: string,
  data: T
) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const regex = new RegExp(`{{(${keys.join("|")})}}`, "g");
  return template.replace(regex, (_, key) => {
    const index = keys.indexOf(key);
    console.log(index);
    return values[index];
  });
};

const bodySchema = z.object({
  data: MailOptionsSchema,
});

export const createEmailApiHandler = <
  TOpts extends Record<string, MailOptions & { data: TOpts[TKeys]["data"] }>,
  TKeys extends keyof TOpts,
  TMailTransporter extends nodemailer.Transporter<SMTPTransport.SentMessageInfo>
>(
  templates: TOpts,
  transporter: TMailTransporter
): NextApiHandler => {
  return async (req, res) => {
    if (req.method !== "POST") {
      return res.status(404).json({ message: "Invalid Method!" });
    }

    const { email } = req.query;
    if (typeof email !== "string") {
      return res.status(400).json({ message: "Invalid Template Name!" });
    }

    if (!templates[email]) {
      return res.status(400).json({ message: "Invalid Template Name!" });
    }

    const template = templates[email];

    if (MailOptionsSchema.safeParse(template).success === false) {
      return res.status(400).json({
        message: "Invalid Template Format Please Provide The Correct One!",
      });
    }

    const { data } = req.body;

    console.log(data);

    const { success } = bodySchema.safeParse({ data });

    if (!success) {
      return res.status(400).json({
        message: "Invalid Body Format Please Provide The Correct One!",
      });
    }

    const { data: bodyData, ...restMailOpts } = data;

    const { data: templateDataFormat } = template;

    for (const key in templateDataFormat) {
      if (!bodyData[key]) {
        return res.status(400).json({
          message: `Missing ${key} in the body!`,
        });
      }
    }
    let html = undefined;
    if (typeof restMailOpts.html === "string") {
      html = parseTemplateHTMLWithData(restMailOpts.html, bodyData);
      restMailOpts.html = html;
      console.log(html);
    }
    try {
      const emailRes = await transporter.sendMail(restMailOpts);

      if (emailRes.accepted.length === 0) {
        return res.status(500).json({ message: "Email not sent!" });
      }

      return res.status(200).json({ message: "Email sent!" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Email not sent!" });
    }
  };
};
