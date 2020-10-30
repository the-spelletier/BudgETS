import { ApiClient } from './ApiClient';

export class BudgetClient {

    list = async (token) => {
        const apiClient = new ApiClient();
        return await apiClient.get('/budget', token);
    }

    get = async (token, budgetId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}`, token);
    }

    getCurrent = async (token) => {
        const apiClient = new ApiClient();
        return await apiClient.get("/budget/current", token);
    }

    update = async (token, id, name, startDate, endDate) => {
        const apiClient = new ApiClient();
        var params = {id, name, startDate, endDate};
        return await apiClient.put(`/budget/${id}`, params, token);
    }

    create = async (token, name, startDate, endDate, isActive) => {
        const apiClient = new ApiClient();
        var params = {name, startDate, endDate, isActive};
        return await apiClient.post('/budget', params, token);
    }

    create = async (token, name, startDate, endDate, isActive, clone, budgetId) => {
        const apiClient = new ApiClient();
        var params = {name, startDate, endDate, isActive};
        if (clone)
            return await apiClient.post(`/budget/${budgetId}/clone`, params, token);
        else
            return await apiClient.post('/budget', params, token);
    }
};