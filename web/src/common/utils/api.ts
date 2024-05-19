import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import useToast from '@hooks/useToast';
import { getCookie } from '@utils/cookie';
import { navigateToSignin } from './navigation';

export type ErrorResponse = {
  message: string;
};
interface Params {
  [key: string]: unknown;
}

interface Data {
  [key: string]: unknown;
}

const Server_Url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;

const axiosInstance = axios.create({
  baseURL: Server_Url,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url?.endsWith('/login') || config.url?.endsWith('/signup')) {
      return config;
    }

    const token = getCookie('accessToken');
    // const token = sessionStorage.getItem('accessToken');
    if (!token) {
      sessionStorage.clear();
      navigateToSignin();

      const error: AxiosError = {
        isAxiosError: true,
        config: config,
        response: {
          status: 401,
          data: {
            error: 'token expired',
          },
          statusText: 'Unauthorized',
          headers: {},
          config: config,
        },
        name: 'AxiosError',
        message: 'token expired',
        toJSON: () => ({}),
      };

      return Promise.reject(error);
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (e: AxiosError) => {
    console.log(`응답 인터셉터 START:`, e);

    const err = e.response;
    const res = err?.data as ErrorResponse;

    if (err?.status) {
      const errData = err.config.data ? JSON.parse(err.config.data) : {};

      switch (err.status) {
        case 401:
          if (!errData.kakaoAccessToken) {
            console.log(`응답 인터셉터 (2)-1: 카카오 에러`, res, 'errData', errData);
            useToast('default', `카카오 동기화 에러 : ${res.message}`);
          }
          if ('useremail' in errData && 'password' in errData) {
            console.log(`응답 인터셉터 - (2)-2: 로그인/회원가입 에러`, res, 'errData', errData);
            useToast('warning', res.message);
          }

          break;

        case 404:
          console.log(`응답 인터셉터 (3)-1: API 경로 에러`, res, 'errData', errData);
          useToast('warning', '잘못된 API 요청입니다.');
          break;

        default:
          console.log(`응답 인터셉터: 기타 에러`, res, 'errData', errData);
          break;
      }

      return;
    }

    if (e.message === 'token expired') {
      useToast('error', '로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      return Promise.reject(e);
    }

    if (e.code === 'ERR_BAD_REQUEST' || e.code === 'ERR_NETWORK') {
      useToast('error', '서버가 닫혀있습니다. 나중에 다시 시도해주세요.');
      return Promise.reject(e);
    }

    return Promise.reject(e);
  },
);

// console.log(`응답 인터셉터 start `, error);

// if (error.response?.status === 409) {
//   const err = error.response.data as ErrorResponse;
//   useToast('warning', err.message);
// }

// if (error.response?.status === 401) {
//   if (error.config?.data) {
//     const data = JSON.parse(error.config.data);
//     console.log(`응답 인터셉터 - (2)`, data);

//     if (data.kakaoAccessToken === null) {
//       console.log(`응답 인터셉터 - (2)-1 : 카카오 에러`, data);
//       return error;
//     }

//     if ('useremail' in data && 'password' in data) {
//       const err = error.response.data as ErrorResponse;
//       console.log(`응답 인터셉터 - (2)-2 : 로그인/회원가입 에러`, err);
//       useToast('warning', err.message);
//       return;
//     }
//   }
//   console.log(`응답 인터셉터 end`, error);
//   sessionStorage.clear();
//   useToast('warning', '인증 정보가 유효하지 않습니다. 다시 로그인해 주세요.');
//   navigateToSignin();
// }

// endpoint : Server_Url 뒤에 오는 path
// ex) 로그인일 때, endpoint는 '/login'
//     const response = await get('/login');

async function get(endpoint: string, params?: Params): Promise<AxiosResponse> {
  if (params) console.log(`%cGET 요청 ${Server_Url + endpoint + '/' + params}`, 'color: #a25cd1;');
  else console.log(`%cGET 요청 ${Server_Url + endpoint}`, 'color: #a25cd1;');

  return axiosInstance.get(endpoint, { params });
}

async function post(endpoint: string, data: Data | FormData): Promise<AxiosResponse> {
  let config = {};
  if (data instanceof FormData) {
    config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    console.log(`%cPOST 요청: ${Server_Url + endpoint}`, 'color: #296aba;');
    console.log(`%cPOST 요청 데이터: `, FormData, 'color: #296aba;');
  } else {
    const bodydata = JSON.stringify(data);

    console.log(`%cPOST 요청: ${Server_Url + endpoint}`, 'color: #296aba;');
    console.log(`%cPOST 요청 데이터: ${bodydata}`, 'color: #296aba;');
  }

  return axiosInstance.post(endpoint, data, config);
}

async function patch(endpoint: string, data?: Data | FormData): Promise<AxiosResponse> {
  let config = {};
  if (data instanceof FormData) {
    config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    console.log(`%cPATCH 요청: ${Server_Url + endpoint}`, 'color: #059c4b;');
    console.log(`%cPATCH 요청 데이터: `, FormData, 'color: #059c4b;');
  } else if (data) {
    const bodydata = JSON.stringify(data);

    console.log(`%cPATCH 요청: ${Server_Url + endpoint}`, 'color: #059c4b;');
    console.log(`%cPATCH 요청 데이터: ${bodydata}`, 'color: #059c4b;');
  }

  return axiosInstance.patch(endpoint, data, config);
}

async function del(endpoint: string, params?: Params): Promise<AxiosResponse> {
  if (params)
    console.log(`%cDELETE 요청 ${Server_Url + endpoint + '/' + params}`, 'color: #c36999');
  else console.log(`%cDELETE 요청 ${Server_Url + endpoint}`, 'color: #c36999');

  return axiosInstance.delete(endpoint, params);
}

// 아래처럼 export한 후, import * as API 방식으로 가져오면,
// API.get, API.post 로 쓸 수 있음.
export { get, post, patch, del as delete };
