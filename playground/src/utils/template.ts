import { z } from "zod";
// idea here is make a template for the email... with the data that is needed to be filled in
// like the html template, the subject, the from, the to, etc.
// these can be passed to the createEmailApiHandler function
// when called in the client it is called with the template name and the data to fill in the template

export const template = {
  bill: {
    html: `<div><h1>Price is {{data.price}}{{data.currency}}</h1></div>`,
    data: z.object({
      price: z.string(),
      currency: z.string(),
    }),
    subject: z.string(),
    to: z.string(),
    attachments: z.array(z.string()),
  },
  welcome: {
    html: `<div><h1>Hello {{data.name}}</h1></div>`,
    data: z.object({
      name: z.string(),
    }),
    subject: z.string(),
    to: z.string(),
    attachments: z.array(z.string()),
  },
};

type t = keyof typeof template;
type x = (typeof template)["bill"]; // "bill" is passed by user
type data = x["data"];
type data2 = z.infer<x["data"]>; // this we can use for the input types in the client
//   ^?
