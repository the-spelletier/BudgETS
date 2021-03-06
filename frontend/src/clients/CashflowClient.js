import { ApiClient } from "./ApiClient";

export class CashflowClient {
    get = async (token, budgetId, type, categoryType) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/category/cashflow/${type}?type=${categoryType}`, token);        
    }

    getGrouped = async (token, budgetId, type, categoryType) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/category/cashflow/${type}?groupBy=${categoryType}`, token);        
    }

    create = async (token, year, month, estimate, categoryId) => {
        const apiClient = new ApiClient();
        const params = {categoryId, year, month, estimate};
        return await apiClient.post('cashflow', params, token);
    }
    
    update = async (token, id, estimate) => {
        const apiClient = new ApiClient();
        const params = {estimate};
        return await apiClient.put(`cashflow/${id}`, params, token);
    }
}