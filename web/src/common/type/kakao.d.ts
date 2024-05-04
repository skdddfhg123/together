declare global {
  type logoutData = { target_id_type: string; target_id: number };

  type reqTokenData = {
    grant_type: string;
    client_id?: string;
    redirect_uri?: string;
    code: string | null;
    client_secret?: string;
  };

  type KakaoEvent = {
    deactivatedAt: boolean;
    endAt: string;
    social: string;
    socialEventId: string;
    startAt: string;
    title: string | null;
    userCalendar: {
      userCalendarId: string;
    };
  };

  interface KakaoLogInRequest {
    redirectUri: string;
    prompt?: string | 'none';
  }
  interface KakaoAPIRequest {
    url: string;
    method?: 'GET' | 'POST' | 'DELETE';
    data?: tokenData | logoutData;
  }
  interface KakaoTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    refresh_token_expires_in: number;
  }

  interface KakaoEventsAndToken {
    resultArray: KakaoEvent[];
    accessTokenCheck: string;
  }
  interface KakaoErrorResponse {
    msg?: string;
  }

  interface Window {
    Kakao: {
      init: (apiKey: string) => void;
      isInitialized: () => boolean;

      Auth: {
        authorize(KakaoLogInRequest);
        setAccessToken(token: string, persist: boolean);
        getAccessToken();
        logout();
      };
      API: {
        request: (request: KakaoAPIRequest) => Promise<kakaoAPIResponse>;
      };
    };
  }
}

export {};
