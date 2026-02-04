import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
const schema = a.schema({
  Todo: a
    .model({
      content: a.string().required(),
      status: a.enum(["TODO", "DOING", "DONE"]),
      dueDate: a.date(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
