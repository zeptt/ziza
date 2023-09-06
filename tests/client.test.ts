import { describe, expect, it } from "vitest";
import {
  isDataFromClientValid,
  isTemplateNameValid,
  isTheDataOfSameKeys,
  isTheDataOfSameLength,
} from "../src/client";
import { z } from "zod";

describe("client", () => {
  it("should check if the isDataOfSameLength function works", () => {
    const mockTemplates = [
      {
        template: {
          welcome: {
            data: {
              name: z.string(),
              age: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
          bill: {
            data: {
              price: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
        },
        dataFromUser: {
          welcome: {
            name: "Ziza",
            age: 20,
          },
          bill: {
            price: 200,
          },
        },
        shouldPass: true,
      },
      {
        template: {
          welcome: {
            data: {
              name: z.string(),
              age: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
          bill: {
            data: {
              price: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
        },
        dataFromUser: {
          welcome: {
            name: 123,
            age: 20,
          },
          bill: {
            price: 200,
          },
        },
        shouldPass: true,
      },
      {
        template: {
          welcome: {
            data: {
              name: z.string(),
              age: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
        },
        dataFromUser: {
          welcome: {
            age: 20,
          },
        },
        shouldPass: false,
      },
      {
        template: {
          welcome: {
            data: {
              age: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
        },
        dataFromUser: {
          welcome: {
            age: 20,
            name: "Ziza",
          },
        },
        shouldPass: false,
      },
    ] as any[];
    mockTemplates.forEach(({ template, dataFromUser, shouldPass }) => {
      const templateNames = Object.keys(template);
      templateNames.forEach((templateName) => {
        const keysInTemplateData = Object.keys(template[templateName]!.data);
        const keysInDataFromUser = Object.keys(dataFromUser[templateName]);
        const isSameLength = isTheDataOfSameLength(
          keysInTemplateData,
          keysInDataFromUser
        );
        if (shouldPass) {
          expect(isSameLength).toBe(true);
        } else {
          expect(isSameLength).toBe(false);
        }
      });
    });
  });

  it("should check if the isDataOfSameKeys function works", () => {
    const mockTemplates = [
      {
        template: {
          welcome: {
            data: {
              name: z.string(),
              age: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
        },
        dataFromUser: {
          welcome: {
            name: "Ziza",
            age: 20,
          },
        },
        shouldPass: true,
      },
      {
        template: {
          welcome: {
            data: {
              name: z.string(),
              age: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
        },
        dataFromUser: {
          welcome: {
            name: 123,
            age: 20,
          },
        },
        shouldPass: true,
      },
      {
        template: {
          welcome: {
            data: {
              name: z.string(),
              age: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
        },
        dataFromUser: {
          welcome: {
            age: 20,
          },
        },
        shouldPass: false,
      },
      {
        template: {
          welcome: {
            data: {
              age: z.number(),
            },
            html: "<div></div>",
            defaults: {},
          },
        },
        dataFromUser: {
          welcome: {
            age: 20,
            name: "Ziza",
          },
        },
        shouldPass: false,
      },
    ] as any[];
    mockTemplates.forEach(({ template, dataFromUser, shouldPass }) => {
      const templateNames = Object.keys(template);
      templateNames.forEach((templateName) => {
        const keysInTemplateData = Object.keys(template[templateName]!.data);
        const keysInDataFromUser = Object.keys(dataFromUser[templateName]);
        const isSameKeys = isTheDataOfSameKeys(
          keysInTemplateData,
          keysInDataFromUser
        );
        const isSameLength = isTheDataOfSameLength(
          keysInTemplateData,
          keysInDataFromUser
        );
        if (shouldPass) {
          expect(isSameKeys && isSameLength).toBe(true);
        } else {
          expect(isSameKeys && isSameLength).toBe(false);
        }
      });
    });
  });

  it("should check if the template name is valid", () => {
    const mockTemplates = [
      {
        template: {
          welcome: {},
        },
        nameOfTemplate: "welcome",
        shouldPass: true,
      },
      {
        template: {
          welcome: {},
        },
        nameOfTemplate: "bill",
        shouldPass: false,
      },
      {
        template: {},
        nameOfTemplate: "welcome",
        shouldPass: false,
      },
      {
        template: {
          welcome: {},
          bill: {},
        },
        nameOfTemplate: "welcome",
        shouldPass: true,
      },
    ];
    mockTemplates.forEach(({ template, nameOfTemplate, shouldPass }) => {
      const isTemplateNameValidated = isTemplateNameValid(
        template,
        nameOfTemplate
      );
      if (shouldPass) {
        expect(isTemplateNameValidated).toBe(true);
      } else {
        expect(isTemplateNameValidated).toBe(false);
      }
    });
  });

  it("should check if the isDataOfSameLength function works", () => {
    const mockTemplates = [
      {
        template: {
          bills: {
            data: {
              price: z.number(),
              noOfItems: z.number(),
            },
            html: `
                  <div>
                    <h1>Welcome !</h1>
                    <p>You bought {{noOfItems}} Cars of {{price}}$.</p>
                    <img src="https://brandslogos.com/wp-content/uploads/images/large/react-logo-1.png" alt="react" />
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
        },
        dataFromUser: {
          welcome: {
            name: "Ziza",
            email: "testing@gmail.com",
          },
          bills: {
            price: 200,
            noOfItems: 2,
          },
        },
        shouldPass: true,
      },
      {
        template: {
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
        },
        dataFromUser: {
          welcome: {
            name: "Ziza",
          },
        },
        shouldPass: false,
      },
      {
        template: {
          welcome: {
            data: {
              email: z.string(),
            },
            html: `
                  <div>
                  <h1>Welcome {{name}} {{email}}!</h1>
                  <p>Thank you for registering with us.</p>
                  </div>
                `,
          },
        },
        dataFromUser: {
          welcome: {
            name: "Ziza",
            email: "testing@gmail.com",
          },
        },
        shouldPass: false,
      },
      {
        template: {
          welcome: {
            data: {},
            html: `
                  <div>
                  <h1>Welcome {{name}} {{email}}!</h1>
                  <p>Thank you for registering with us.</p>
                  </div>
                `,
          },
        },
        dataFromUser: {
          welcome: {
            name: "Ziza",
            email: "testing@gmail.com",
          },
        },
        shouldPass: false,
      },
      {
        template: {
          welcome: {
            data: {},
            html: `
                  <div>
                  <h1>Welcome {{name}} {{email}}!</h1>
                  <p>Thank you for registering with us.</p>
                  </div>
                `,
          },
        },
        dataFromUser: {
          welcome: {},
        },
        shouldPass: true,
      },
    ];
    mockTemplates.forEach(({ template, dataFromUser, shouldPass }) => {
      const templateNames = Object.keys(template);
      templateNames.forEach((templateName) => {
        const isSameLength = isDataFromClientValid(
          template,
          templateName,
          (dataFromUser as any)[templateName]
        );
        if (shouldPass) {
          expect(isSameLength).toBe(true);
        } else {
          expect(isSameLength).toBe(false);
        }
      });
    });
  });
});
