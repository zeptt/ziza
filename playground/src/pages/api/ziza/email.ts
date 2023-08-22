import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { z } from "zod";

type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
  to: string;
  cc?: string;
  bcc?: string;
  attachments?: any[];
  from?: string;
};

type TransporterOpts = {
  from: string;
  password: string;
};

const createTransporter = (
  opts: TransporterOpts,
  args: SMTPTransport.Options = {}
) => {
  return nodemailer.createTransport({
    ...args,
    auth: {
      user: opts.from,
      pass: opts.password,
    },
  });
};

const templates = [] satisfies Array<Record<string, SMTPTransport.MailOptions>>;

const createEmailApiHandler = <
  TOpts extends Record<string, any>[],
  TMailTransporter extends nodemailer.Transporter<SMTPTransport.SentMessageInfo>
>(
  opts: TOpts,
  transporter: TMailTransporter
): NextApiHandler => {
  // get drtails from body and validate with zod
  // we have the template name, and the data we can get from the types
  // using the transport we can send the email with the data
  // think abt attachments more
  return async (req, res) => {
    res.status(200).json({ message: "Email sent!" });
  };
};

export default createEmailApiHandler(
  templates,
  createTransporter(
    {
      from: "geoffreyantoignatius@gmail.com",
      password: "xxxxxxxxxxxxxxxxx",
    },
    // make this as adapters to import and use
    {
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
    }
  )
);
