import { ApiClient } from './ApiClient';

export class CategoryClient {
    create = async (token, budgetId, name, type, orderNumber) => {
        const apiClient = new ApiClient();
        var params = {budgetId, name, type, orderNumber};
        return await apiClient.post('/category', params, token);
    }

    getList = async (token, budgetId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/category`, token);
    }

    getRevenuesOrExpenses = async (token, budgetId, type) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/category?type=${type}`, token);
    }

    getSummary = async (token, budgetId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/category/summary`, token);
    }

    get = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/category/${id}`, token);
    }

    update = async (token, budgetId, id, name, type, orderNumber) => {
        const apiClient = new ApiClient();
        var params = {budgetId, name, type, orderNumber};
        return await apiClient.put(`/category/${id}`, params, token);
    }

    delete = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/category/${id}`, token);
    }
}