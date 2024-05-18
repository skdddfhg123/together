import axios, { AxiosResponse } from 'axios';

const Redis_Url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/redis`;

const axiosInstance = axios.create({
  baseURL: Redis_Url,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

interface Data {
  [key: string]: unknown;
}

async function get(endpoint: string): Promise<AxiosResponse> {
  console.log(`%cRedis GET 요청 ${Redis_Url + endpoint}`, 'color: #B0C460;');

  return axiosInstance.get(endpoint);
}

async function post(endpoint: string, data: Data | FormData): Promise<AxiosResponse> {
  const bodydata = JSON.stringify(data);

  console.log(`%cPOST 요청: ${Redis_Url + endpoint}`, 'color: #B0C460;');
  console.log(`%cPOST 요청 데이터: ${bodydata}`, 'color: #B0C460;');

  return axiosInstance.post(endpoint, data);
}

export { get, post };
