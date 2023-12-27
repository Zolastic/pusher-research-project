import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "pusher-research-project",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
          GITHUB_ID: process.env.GITHUB_ID,
          GITHUB_SECRET: process.env.GITHUB_SECRET,
          PUSHER_APP_ID: process.env.PUSHER_APP_ID,
          PUSHER_SECRET: process.env.PUSHER_SECRET,
          PUSHER_KEY: process.env.PUSHER_KEY,
          NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
