import axios from 'axios';
import {local} from '../config/env';

export default axios.create({baseURL: local.baseUrl});