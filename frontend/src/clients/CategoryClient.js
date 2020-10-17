import { ApiClient } from './ApiClient';

export class CategoryClient {
    create = async (token, budgetId, name, type) => {
        const apiClient = new ApiClient();
        var params = {budgetId, name, type};
        return await apiClient.post('/category', params, token);
    }

    getList = async (token, budgetId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/category`, token);
    }

    update = async (token, budgetId, id, name, type) => {
        const apiClient = new ApiClient();
        var params = {budgetId, name, type};
        return await apiClient.put(`/category/${id}`, params, token);
    }

    delete = async (token, budgetId, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/category/${id}?budgetId=${budgetId}`, token);
    }
}