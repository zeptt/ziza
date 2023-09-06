import type { NextApiHandler } from "next";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ApiBodySchema, TransporterOpts, EmailOptionsSchema } from "./types";
import * as z from "zod";

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

// Fill the {{}} with the data
const populateTemplateHTMLWithData = <T extends Record<string, any>>(
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

export const createEmailApiHandler = <
  T extends Record<
    string,
    { data: Record<string, z.ZodNumber | z.ZodString>; html: string } & {
      defaults?: z.infer<typeof EmailOptionsSchema>;
    }
  >,
  TMailTransporter extends nodemailer.Transporter<SMTPTransport.SentMessageInfo>
>(
  templates: T,
  transporter: TMailTransporter
): NextApiHandler => {
  return async (req, res) => {
    if (req.method !== "POST") {
      return res.status(404).json({ message: "Invalid Method!" });
    }

    const dataFromApi = ApiBodySchema.safeParse(req.body);

    if (!dataFromApi.success) {
      return res.status(400).json({
        message: "Invalid Data! Please Check the format of json payload!",
      });
    }

    // We have preformed the dataObj validation in client side
    // So we can safely assume that the dataObj is valid
    //! Future: Check Again or move the validation to server side

    // get the template name from the dynamic route
    const { ziza: templateName } = req.query;

    if (typeof templateName !== "string") {
      return res.status(400).json({ message: "Invalid Template Name!" });
    }

    if (!templates[templateName]) {
      return res.status(400).json({ message: "Invalid Template Name!" });
    }

    if (!EmailOptionsSchema.safeParse(dataFromApi.data.emailOptions).success) {
      return res.status(400).json({ message: "Messed up the email options!" });
    }

    const htmlPopulatedWithData = populateTemplateHTMLWithData(
      dataFromApi.data.html,
      dataFromApi.data.data
    );

    const emailPayload = {
      html: htmlPopulatedWithData,
      ...dataFromApi.data.emailOptions,
    };

    try {
      const emailRes = await transporter.sendMail(emailPayload);
      if (emailRes.accepted.length === 0) {
        return res.status(500).json({ message: "Email Not Sent!" });
      } else if (emailRes.rejected.length === 0) {
        return res.status(200).json({ message: "Email Sent!" });
      } else {
        return res
          .status(500)
          .json({ message: "Email Not Sent, Something Went Wrong!" });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
};
