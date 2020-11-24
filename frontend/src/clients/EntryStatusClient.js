import { ApiClient } from "./ApiClient";

export class EntryStatusClient {
    get = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/status/${id}`, token);
    }
    
    getAll = async (token) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/status`, token);
    }

    create = async (token, name, position) => {
        const apiClient = new ApiClient();
        var params = { name, position };
        return await apiClient.post('/status', params, token);
    }

    update = async (token, id, name, position) => {
        const apiClient = new ApiClient();
        var params = { name, position };
        return await apiClient.put(`/status/${id}`, params, token);
    }

    delete = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/status/${id}`, token);
    }
}