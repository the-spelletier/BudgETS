import axios from 'axios';
import ApiBaseClient from './ApiBaseClient';

export class ApiClient {
    get = async (path) => {
        return await ApiBaseClient.get(path);
    }

    post = async (path, params) => {
        return await ApiBaseClient.post(path, params);
    }

    delete = async (path) => ApiBaseClient.delete(path);
}