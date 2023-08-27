import { createEmailClient } from "./client";
import { createTemplate } from "./template";
import {
  gmailSmtpTransporterAdapter,
  office365SmtpTransporterAdapter,
  outlookSmtpTransporterAdapter,
} from "./adapters";
import {
  createTransporter,
  createEmailApiHandler,
  getHtmlTemplate,
} from "./server";

export {
  createEmailClient,
  createTemplate,
  gmailSmtpTransporterAdapter,
  office365SmtpTransporterAdapter,
  outlookSmtpTransporterAdapter,
  createTransporter,
  createEmailApiHandler,
  getHtmlTemplate,
};
