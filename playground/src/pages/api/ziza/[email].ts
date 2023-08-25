import {
  createEmailApiHandler,
  createTransporter,
  getHtmlTemplate,
  gmailSmtpTransporterAdapter,
} from "@/utils/email";
import path from "path";

export default createEmailApiHandler(
  {
    welcome: {
      data: {
        name: "",
        age: 0,
        address: "",
      },
      html: getHtmlTemplate(
        path.join(process.cwd(), "src", "template", "bills.html")
      ),
      to: "geoffreyanto12@gmail.com",
      subject: "Welcome to Ziza",
    },
  },
  createTransporter({
    auth: {
      from: "geoffreyantoignatius@gmail.com",
      password: "eznxsixrjcqdslyn",
    },
    smtpTransporter: gmailSmtpTransporterAdapter,
  })
);
