import {
  createEmailApiHandler,
  createTransporter,
  getHtmlTemplate,
  gmailSmtpTransporterAdapter,
} from "@/utils/email";
import { template } from "@/utils/template";
import path from "path";

export default createEmailApiHandler(
  template,
  createTransporter({
    auth: {
      from: "geoffreyantoignatius@gmail.com",
      password: "eznxsixrjcqdslyn",
    },
    smtpTransporter: gmailSmtpTransporterAdapter,
  })
);
