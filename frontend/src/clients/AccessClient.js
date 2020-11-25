import { ApiClient } from './ApiClient';

export class AccessClient {

    getAll = async (token, budgetId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/access`, token);
    }

    create = async (token, budgetId, userId) => {
        const apiClient = new ApiClient();
        return await apiClient.post(`/budget/${budgetId}/access`, {userId}, token);
    }

    delete = async (token, budgetId, userId) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/budget/${budgetId}/access/${userId}`, token);
    }
}