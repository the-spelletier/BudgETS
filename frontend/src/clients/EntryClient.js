import { ApiClient } from "./ApiClient";

export class EntryClient {
    getList = async (token, budgetId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/entry`, token);
    }

    create = async (token, type, categoryId, lineId, receiptId, member, description, date, status, amount) => {
        const apiClient = new ApiClient();
        var params = { type, categoryId, lineId, receiptId, member, description, date, status, amount};
        return await apiClient.post('/entry', params, token);
    }
}