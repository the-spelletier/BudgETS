import { ApiClient } from "./ApiClient";

export class EntryStatusClient {
    get = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/status/${id}`, token);
    }
    
    getAll = async (token, budgetId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/status`, token);
    }

    create = async (token, name, position, budgetId, notify) => {
        const apiClient = new ApiClient();
        var params = { name, position, budgetId, notify };
        return await apiClient.post('/status', params, token);
    }

    update = async (token, id, name, position, notify) => {
        const apiClient = new ApiClient();
        var params = { name, position, notify };
        return await apiClient.put(`/status/${id}`, params, token);
    }

    delete = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/status/${id}`, token);
    }
}