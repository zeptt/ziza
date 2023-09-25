import { gmailSmtpTransporterAdapter } from "ziza/adapters";
import { createEmailApiHandler, createTransporter } from "ziza/server";
import { template } from "@/template/template";

export default createEmailApiHandler(
  template,
  createTransporter({
    auth: {
      from: "youremailaddress@gmail.com",
      password: process.env.GMAIL_PASSWORD as string,
    },
    smtpTransporter: gmailSmtpTransporterAdapter,
  })
);
