import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://610a6f592a59be9f6d8199e988cb64fe@o4509712407199744.ingest.de.sentry.io/4509712413622352",
  integrations: [
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
  ],
});