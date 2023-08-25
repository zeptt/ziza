import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import * as z from "zod";
import { MailOptions, MailOptionsSchema } from "./types";
import type { NextApiHandler } from "next";

type TransporterOpts = {
  from: string;
  password: string;
};

type CreateTransporterOpts = {
  auth: TransporterOpts;
  smtpTransporter: SMTPTransport.Options;
};

const createTransporter = (opts: CreateTransporterOpts) => {
  return nodemailer.createTransport({
    ...opts.smtpTransporter,
    auth: {
      user: opts.auth.from,
      pass: opts.auth.password,
    },
  });
};

function createEmailTemplate<
  TObj extends Record<string, MailOptions & { data: TObj[TKeys]["data"] }>,
  TKeys extends keyof TObj
>(templates: TObj) {
  try {
    for (const keys in templates) {
      const template = templates[keys];
      MailOptionsSchema.parse(template);
    }
    return templates;
  } catch (e) {
    console.error("Please Provide The Correct Types For The Template");
    return undefined;
  }
}

const createEmailApiHandler = <
  TOpts extends Record<string, MailOptions & { data: TOpts[TKeys]["data"] }>,
  TKeys extends keyof TOpts,
  TMailTransporter extends nodemailer.Transporter<SMTPTransport.SentMessageInfo>
>(
  templates: TOpts,
  transporter: TMailTransporter
): NextApiHandler => {
  return async (req, res) => {
    res.status(200).json({ message: "Email sent!" });
  };
};

export { createTransporter, createEmailTemplate, createEmailApiHandler };

export type { TransporterOpts, CreateTransporterOpts };
