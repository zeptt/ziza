import { NextResponse, type NextRequest } from "next/server";
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
): any => {
  return async (req: NextRequest) => {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Invalid Method!" },
        {
          status: 404,
        }
      );
    }

    const dataFromApi = ApiBodySchema.safeParse(await req.json());

    if (!dataFromApi.success) {
      return NextResponse.json(
        {
          message: "Invalid Data! Please Check the format of json payload!",
        },
        {
          status: 400,
        }
      );
    }

    // get the template name from the dynamic route
    const templateName = req.nextUrl.searchParams.get("ziza");

    if (typeof templateName !== "string") {
      return NextResponse.json(
        { message: "Invalid Template Name!" },
        {
          status: 400,
        }
      );
    }

    if (!templates[templateName]) {
      return NextResponse.json(
        { message: "Invalid Template Name!" },
        {
          status: 400,
        }
      );
    }

    if (!EmailOptionsSchema.safeParse(dataFromApi.data.emailOptions).success) {
      return NextResponse.json(
        { message: "Messed up the email options!" },
        {
          status: 400,
        }
      );
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
        return NextResponse.json(
          { message: "Email Not Sent!" },
          {
            status: 500,
          }
        );
      } else if (emailRes.rejected.length === 0) {
        return NextResponse.json(
          { message: "Email Sent!" },
          {
            status: 500,
          }
        );
      } else {
        return NextResponse.json(
          {
            message: "Email Not Sent, Something Went Wrong!",
          },
          {
            status: 500,
          }
        );
      }
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message },
        {
          status: 500,
        }
      );
    }
  };
};
