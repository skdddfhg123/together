import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie } from '@utils/cookie';

const serverUrl = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;

const axiosInstance = axios.create({
  baseURL: serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url?.endsWith('/login')) {
      return config;
    }

    const token = getCookie('accessToken');
    if (!token) {
      alert('로그인 세션이 만료되었습니다.');
      window.location.href = 'http://localhost:3000/signin';
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

interface Params {
  [key: string]: unknown;
}

interface Data {
  [key: string]: unknown;
}

// endpoint : serverUrl 뒤에 오는 path
// ex) 로그인일 때, endpoint는 '/login'
//     const response = await get('/login');

async function get(endpoint: string, params?: Params): Promise<AxiosResponse> {
  if (params) console.log(`%cGET 요청 ${serverUrl + endpoint + '/' + params}`, 'color: #a25cd1;');
  else console.log(`%cGET 요청 ${serverUrl + endpoint}`, 'color: #a25cd1;');

  return axiosInstance.get(endpoint, { params });
}

async function post(endpoint: string, data: Data): Promise<AxiosResponse> {
  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}
  const bodyData = JSON.stringify(data);

  console.log(`%cPOST 요청: ${serverUrl + endpoint}`, 'color: #296aba;');
  console.log(`%cPOST 요청 데이터: ${bodyData}`, 'color: #296aba;');

  return axiosInstance.post(endpoint, JSON.stringify(data));
}

async function patch(endpoint: string, data: Data): Promise<AxiosResponse> {
  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}
  const bodyData = JSON.stringify(data);

  console.log(`%cPUT 요청: ${serverUrl + endpoint}`, 'color: #059c4b;');
  console.log(`%cPUT 요청 데이터: ${bodyData}`, 'color: #059c4b;');

  return axiosInstance.patch(endpoint, JSON.stringify(data));
}

async function del(endpoint: string, params?: Params): Promise<AxiosResponse> {
  if (params) console.log(`%cDELETE 요청 ${serverUrl + endpoint + '/' + params}`, 'color: #c36999');
  else console.log(`%cDELETE 요청 ${serverUrl + endpoint}`, 'color: #c36999');

  return axiosInstance.delete(endpoint, params);
}

// 아래처럼 export한 후, import * as API 방식으로 가져오면,
// API.get, API.post 로 쓸 수 있음.
export { get, post, patch, del as delete };
