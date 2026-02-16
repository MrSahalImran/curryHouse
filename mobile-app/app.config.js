import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export default ({ config }) => ({
  ...config,

  // Required by EAS
  name: "Curry House Jar",
  slug: "curry-house-jar",
  owner: "bheemji",
  version: "1.0.0",

  extra: {
    ...config.extra,

    API_URL: process.env.EXPO_PUBLIC_API_URL,

    eas: {
      projectId: "cae9cfe0-d5c3-428e-b39b-8b8bcc5bdd8c",
    },
  },
});
