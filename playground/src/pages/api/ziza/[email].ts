import {
  createEmailApiHandler,
  createTransporter,
  gmailSmtpTransporterAdapter,
} from "@/utils/email";

export default createEmailApiHandler(
  {
    bills: {
      data: {
        name: "",
        email: "",
      },
    },
    coupon: { data: {} },
  },
  createTransporter({
    auth: {
      from: "geoffreyantoignatius@gmail.com",
      password: "eznxsixrjcqdslyn",
    },
    smtpTransporter: gmailSmtpTransporterAdapter,
  })
);
