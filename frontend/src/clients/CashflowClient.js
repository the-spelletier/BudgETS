import { ApiClient } from "./ApiClient";

export class CashflowClient {
    get = async (token, budgetId, type) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/category/cashflow/${type}`, token);        
    }
}