import { registerAs } from '@nestjs/config';

export default registerAs('msal', () => ({
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback: (logLevel, message, containsPii) => {
        // console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: "Verbose",
    },
  },
}));
