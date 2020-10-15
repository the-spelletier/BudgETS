import ApiBaseClient from './ApiBaseClient';

export class ApiClient {
    get = async (path, token) => {
        return await ApiBaseClient.get(path, {headers: {'Authorization': `Bearer ${token}`}});
    }

    post = async (path, params, token) => {
        return await ApiBaseClient.post(path, params, {headers: {'Authorization': `Bearer ${token}`}});
    }
    
    put = async (path, params, token) => {
        return await ApiBaseClient.put(path, params, {headers: {'Authorization': `Bearer ${token}`}});
    }

    delete = async (path, token) => ApiBaseClient.delete(path, {headers: {'Authorization': `Bearer ${token}`}});
}