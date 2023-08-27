import { z } from "zod";
import { emailOptionsSchema } from "./template";

const createEmailClient = <
  T extends Record<
    string,
    { data: Record<string, z.Schema>; html: string } & {
      defaults?: z.infer<typeof emailOptionsSchema>;
    }
  >
>(
  template: T
) => {
  const templateSchema = z.record(
    z.object({
      data: z.record(z.object({})),
      html: z.string(),
      defaults: emailOptionsSchema.optional(),
    })
  );
  const isValidTemplate = templateSchema.safeParse(template);
  if (!isValidTemplate.success) {
    throw new Error("Invalid template");
  }
  return {
    sendEmail: async <K extends keyof T>(
      templateName: K,
      dataFromClient: {
        [DKey in keyof T[K]["data"]]: z.infer<T[K]["data"][DKey]>;
      },
      options: z.infer<typeof emailOptionsSchema>
    ) => {
      // check the template exists
      if (!template[templateName]) {
        throw new Error(
          "Invalid template! Template does not exist, Please check the template name."
        );
      }

      const keysInTemplateData = Object.keys(template[templateName].data);
      const keysInDataFromUser = Object.keys(dataFromClient);

      // check if the no of keys in template data and data from user are same
      if (keysInTemplateData.length !== keysInDataFromUser.length) {
        throw new Error("Invalid data! The Passed data does not match schema.");
      } else {
        // Check if there is any key that exists in template but not in data from user
        keysInTemplateData.forEach((key) => {
          if (!keysInDataFromUser.includes(key)) {
            throw new Error(
              "Invalid data! Found Key that does not exist in template."
            );
          }
        });

        // Check if there is any key that exists in data from user but not in template
        keysInDataFromUser.forEach((key) => {
          if (!keysInTemplateData.includes(key)) {
            throw new Error(
              "Invalid data! Found Key that does not exist in template."
            );
          }
        });

        // parse the data with the schema in template's data object
        keysInTemplateData.forEach((key) => {
          if (
            !template[templateName].data[key].safeParse(dataFromClient[key])
              .success
          ) {
            throw new Error(
              "Invalid data! The Passed data does not match the schema in template."
            );
          }
        });
      }

      // Check if the email options are valid
      const emailOptionsToBeSent = emailOptionsSchema.safeParse(options);
      if (!emailOptionsToBeSent.success) {
        throw new Error("Invalid email options");
      }

      //! This is commented out for now, make sure we implement this later in the server
      //! Then Change the payload to the commented one below
      const payload = {
        data: dataFromClient,
        emailOptions: {
          ...template[templateName].defaults,
          ...emailOptionsToBeSent.data,
        },
        html: template[templateName].html,
      };

      try {
        const res = await fetch(`/api/ziza/${String(templateName)}`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },

          //! TODO: Change this to "same-origin" once we deploy or if needed
          mode: "same-origin",
        });

        const dataFromServer = await res.json();

        if (res.status !== 200) throw new Error(dataFromServer.message);

        return dataFromServer.message;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  };
};

export { createEmailClient };
