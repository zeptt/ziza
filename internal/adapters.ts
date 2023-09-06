import SMTPTransport from "nodemailer/lib/smtp-transport";

type TransporterAdapterOptions = SMTPTransport.Options;

const gmailSmtpTransporterAdapter: TransporterAdapterOptions = {
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: true,
};

const outlookSmtpTransporterAdapter: TransporterAdapterOptions = {
  host: "smtp-mail.outlook.com",
  service: "outlook",
  port: 587,
  secure: false,
  tls: {
    ciphers: "SSLv3",
  },
};

const office365SmtpTransporterAdapter: TransporterAdapterOptions = {
  host: "smtp.office365.com",
  service: "Outlook365",
  port: 587,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
};

export {
  gmailSmtpTransporterAdapter,
  outlookSmtpTransporterAdapter,
  office365SmtpTransporterAdapter,
};
