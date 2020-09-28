import ApiBaseClient from './ApiBaseClient';

export class ApiClient {
    get = async (path, token) => {
        return await ApiBaseClient.get(path, {headers: {'Authorization': `Bearer ${token}`}});
    }

    post = async (path, params, token) => {
        return await ApiBaseClient.post(path, params, {headers: {'Authorization': `Bearer ${token}`}});
    }

    delete = async (path) => ApiBaseClient.delete(path);
}