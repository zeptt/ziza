# 📧 Ziza - Next.js Email Service for the Client

Ziza is an open-source Next.js-based email service for the client. It's fully type-safe, making it easy to send emails from your Next.js application with confidence. Ziza utilizes Node Mailer under the hood to send emails and provides a template system that helps you craft beautiful and dynamic email content.

## Features

✉️ Fully type-safe email templates with automatic data prompts.  
📨 Backend configured with Node Mailer.  
📄 HTML-based email templates.  
🔒 Secure SMTP transport options.  
📦 Attachments support.  

## Installation

To get started with Ziza, you need to install it using npm or yarn:

```bash
npm install ziza
# or
yarn add ziza
```

## Usage

### 1. Create Email Templates

Define your email templates using the `createTemplate` function provided by Ziza. Here's an example:

```typescript
import { createTemplate } from "ziza/template";
import { z } from "zod";

export const template = createTemplate({
  bills: {
    data: {
      price: z.number(),
      noOfItems: z.number(),
    },
    html: `
      <div>
        <h1>Welcome !</h1>
        <p>You bought {{noOfItems}} Cars of {{price}}$.</p>
      </div>
    `,
    defaults: {
      subject: "Your bill!",
    },
  },
  welcome: {
    data: {
      name: z.string(),
      email: z.string(),
    },
    html: `
      <div>
        <h1>Welcome {{name}} {{email}}!</h1>
        <p>Thank you for registering with us.</p>
      </div>
    `,
  },
});
```

### 2. Configure Email Transporter

Configure the email transporter, specifying the SMTP transport adapter. For example, using Gmail's SMTP:

```javascript
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
```

### 3. Send Emails

Now you can use Ziza to send emails easily:

```javascript
import { createEmailClient } from "ziza";

const emailClient = createEmailClient(template);
```

## Example Snippets

Here are some example snippets for using Ziza:

- **Creating an Email Template:**

  ```javascript
  export const template = createTemplate({
    // Your template definitions here
  });
  ```

- **Configuring the Email Transporter:**

  ```javascript
  import { gmailSmtpTransporterAdapter } from "ziza/adapters";
  import { createEmailApiHandler, createTransporter } from "ziza/server";

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
  ```

- **Sending an Email:**

  ```javascript
  const emailClient = createEmailClient(template);

  const res = await emailClient.sendEmail(
    "bills",
    { price: 100, noOfItems: 1234128 },
    {
      to: "youremailaddress@gmail.com",
      cc: "youremailaddress@vitstudent.ac.in",
      attachments: [
        {
          filename: fileName,
          encoding: "base64",
          content: base64Data,
        },
      ],
    }
  );
  ```

## 🚀 Get Started

To start using Ziza in your Next.js project, follow the installation and usage instructions in this README.

## 📖 Documentation

For more details on Ziza's features and usage, please refer to the [official documentation](https://ziza-docs.example.com).

## 🧪 Testing

Ziza comes with a comprehensive test suite. You can run tests using:

```bash
npm test
# or
yarn test
```

## 🤝 Contributing

We welcome contributions! Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/zeptt/ziza).

## 📃 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

📧 Ziza is developed and maintained with ❤️ by US.
