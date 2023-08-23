import {
  createEmailApiHandler,
  createTransporter,
  gmailSmtpTransporterAdapter,
  t,
} from "@/utils/email";

export default createEmailApiHandler(
  { bills: { data: {} } },
  createTransporter({
    auth: {
      from: "geoffreyantoignatius@gmail.com",
      password: process.env.GMAIL_PASSWORD || "password",
    },
    smtpTransporter: gmailSmtpTransporterAdapter,
  })
);
