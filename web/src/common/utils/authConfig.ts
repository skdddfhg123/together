const clientId = process.env.REACT_APP_MICROSOFT_CLIENT_ID as string;
const tenantId = process.env.REACT_APP_AZURE_TENENT_ID as string;

export const msalConfig = {
  auth: {
    clientId: 'b23ac01f-6f16-4c7d-9ae9-23b6e445c59e',
    authority: `https://login.microsoftonline.com/b1b9b246-22b0-47ab-ab54-32487ccc176b`,
    // clientId: clientId,
    // authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: 'http://toogether.site:3005/connection', // 리디렉션 URI
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'Calendars.Read'], // 필요한 권한 범위
};
