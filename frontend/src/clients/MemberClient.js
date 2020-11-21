import { ApiClient } from './ApiClient';

export class MemberClient {
    get = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/member/${id}`, token);
    }

    getAll = async (token, userId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`user/${userId}/members`, token);
    }

    create = async (token, name, code, email, active, notify) => {
        const apiClient = new ApiClient();
        var params = { name, code, email, active, notify };
        return await apiClient.post('/member', params, token);
    }

    update = async (token, id, name, code, email, active, notify) => {
        const apiClient = new ApiClient();
        var params = { name, code, email, active, notify };
        return await apiClient.put(`/member/${id}`, params, token);
    }

    delete = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/member/${id}`, token);
    }
}