import axios from 'axios';
import { local } from '../config/env';
import { createHashHistory } from 'history'
const history = createHashHistory()

const instance = axios.create({baseURL: local.baseUrl});

instance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    if (localStorage.getItem('token')){
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      history.push("/auth");
    }
  }
  return error.response;
});

export default instance;