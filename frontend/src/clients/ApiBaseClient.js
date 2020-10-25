import axios from 'axios';
import { local } from '../config/env';
import { createHashHistory } from 'history'
const history = createHashHistory()

const instance = axios.create({baseURL: local.baseUrl});

instance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
      localStorage.removeItem('token');
      history.push("/login");
  }
  return error;
});

export default instance;