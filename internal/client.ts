import { EmailOptionsSchema, templateSchema } from "./types";
import { z } from "zod";

const isTemplateNameValid = <T extends Record<string, any>>(
  template: T,
  templateName: string
) => {
  if (
    Object.keys(template).includes(templateName) &&
    template[templateName] !== undefined &&
    template[templateName] !== null
  ) {
    return true;
  } else {
    return false;
  }
};

const isTheDataOfSameLength = (
  keysInTemplateData: string[],
  keysInDataFromUser: string[]
) => {
  if (keysInTemplateData.length !== keysInDataFromUser.length) {
    return false;
  } else {
    return true;
  }
};

const isTheDataOfSameKeys = (
  keysInTemplateData: string[],
  keysInDataFromUser: string[]
) => {
  keysInTemplateData.forEach((key) => {
    if (!keysInDataFromUser.includes(key)) {
      return false;
    }
  });

  // Check if there is any key that exists in data from user but not in template
  keysInDataFromUser.forEach((key) => {
    if (!keysInTemplateData.includes(key)) {
      return false;
    }
  });

  return true;
};

const isDataFromClientValid = <T extends Record<string, any>>(
  template: T,
  templateName: string,
  dataFromClient: Record<string, any>
) => {
  const keysInTemplateData = Object.keys(template[templateName]!.data);
  const keysInDataFromUser = Object.keys(dataFromClient);

  // check if the no of keys in template data and data from user are same
  if (!isTheDataOfSameLength(keysInTemplateData, keysInDataFromUser)) {
    return false;
  } else {
    // Check if there is any key that exists in template but not in data from user
    if (!isTheDataOfSameKeys(keysInTemplateData, keysInDataFromUser))
      return false;

    // parse the data with the schema in template's data object
    keysInTemplateData.forEach((key) => {
      if (
        !template[templateName]!.data[key]!.safeParse(dataFromClient[key])
          .success
      ) {
        return false;
      }
    });
    return true;
  }
};

const createEmailClient = <
  T extends Record<
    string,
    { data: Record<string, z.ZodNumber | z.ZodString>; html: string } & {
      defaults?: z.infer<typeof EmailOptionsSchema>;
    }
  >
>(
  template: T
) => {
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
      options: z.infer<typeof EmailOptionsSchema>
    ) => {
      if (!isTemplateNameValid(template, templateName as string)) {
        throw new Error(
          "Invalid template! Template does not exist, Please check the template name."
        );
      }

      if (
        !isDataFromClientValid(template, templateName as string, dataFromClient)
      ) {
        throw new Error(
          "Invalid data! The Passed data does not match the schema in template. Please check the data."
        );
      }

      // Check if the email options are valid
      const emailOptionsToBeSent = EmailOptionsSchema.safeParse(options);
      if (!emailOptionsToBeSent.success) {
        throw new Error("Invalid email options");
      }

      const payload = {
        data: dataFromClient,
        emailOptions: {
          ...template[templateName]!.defaults,
          ...emailOptionsToBeSent.data,
        },
        html: template[templateName]!.html,
      };

      try {
        const res = await fetch(`/api/ziza/${String(templateName)}`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
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

export {
  createEmailClient,
  isTemplateNameValid,
  isDataFromClientValid,
  isTheDataOfSameKeys,
  isTheDataOfSameLength,
};
