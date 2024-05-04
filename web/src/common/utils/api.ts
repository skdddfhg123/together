import axios from 'axios';
import { getCookie } from '@utils/cookie';
// axios.defaults.withCredentials = true;

const serverUrl = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;

interface Params {
  [key: string]: unknown;
}

interface Data {
  [key: string]: unknown;
}

// endpoint : serverUrl 뒤에 오는 path
// ex) 로그인일 때, endpoint는 '/login'
//     const response = await get('/login');

async function get(endpoint: string, params?: Params) {
  console.log(`%cGET 요청 ${serverUrl + endpoint}`, 'color: #a25cd1;');

  return axios.get(serverUrl + endpoint, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      Authorization: `Bearer ${getCookie('accessToken')}`,
    },
    withCredentials: true,
    params: params,
  });
}

async function post(endpoint: string, data: Data) {
  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}
  const bodyData = JSON.stringify(data);

  console.log(`%cPOST 요청: ${serverUrl + endpoint}`, 'color: #296aba;');
  console.log(`%cPOST 요청 데이터: ${bodyData}`, 'color: #296aba;');

  return axios.post(serverUrl + endpoint, bodyData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getCookie('accessToken')}`,
    },
  });
}

async function patch(endpoint: string, data: Data) {
  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}
  const accessToken = getCookie('accessToken');
  const bodyData = JSON.stringify(data);
  console.log(`%cPUT 요청: ${serverUrl + endpoint}`, 'color: #059c4b;');
  console.log(`%cPUT 요청 데이터: ${bodyData}`, 'color: #059c4b;');

  return axios.patch(serverUrl + endpoint, bodyData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// 아래 함수명에 관해, delete 단어는 자바스크립트의 reserved 단어이기에,
// 여기서는 우선 delete 대신 del로 쓰고 아래 export 시에 delete로 alias 함.
async function del(endpoint: string, params = '') {
  const accessToken = getCookie('accessToken');
  console.log(`%cDELETE 요청 ${serverUrl + endpoint + '/' + params}`, 'color: #c36999');
  return axios.delete(serverUrl + endpoint + '/' + params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// 아래처럼 export한 후, import * as API 방식으로 가져오면,
// API.get, API.post 로 쓸 수 있음.
export { get, post, patch, del as delete };
