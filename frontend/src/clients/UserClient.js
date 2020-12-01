import { ApiClient } from './ApiClient';

export class UserClient {
    get = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/user/${id}`, token);
    }

    getAll = async (token) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/users`, token);
    }

    create = async (token, username, password, isAdmin) => {
        console.log(`tryCreate`);
        const apiClient = new ApiClient();
        var params = { username, password, isAdmin };
        return await apiClient.post('/user', params, token);
    }

    update = async (token, id, password, isAdmin) => {
        const apiClient = new ApiClient();
        var params = { id, password, isAdmin };
        return await apiClient.put(`/user/${id}`, params, token);
    }

    delete = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/user/${id}`, token);
    }
}