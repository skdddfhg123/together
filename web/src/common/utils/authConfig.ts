const clientId = process.env.REACT_APP_MICROSOFT_CLIENT_ID as string;
const tenantId = process.env.REACT_APP_AZURE_TENENT_ID as string;

export const msalConfig = {
  auth: {
    clientId: '65414a67-5b95-4220-a531-5f3a9e8e11ed',
    authority:
      'https://login.microsoftonline.com/common/oauth2/v2.0/authorize/b1b9b246-22b0-47ab-ab54-32487ccc176b',
    // clientId: clientId,
    // authority: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize/${tenantId}`,
    redirectUri: 'http://toogether.site:3005/connection',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'Calendars.Read'], // 필요한 권한 범위
};
