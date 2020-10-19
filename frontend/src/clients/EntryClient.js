import { ApiClient } from "./ApiClient";

export class EntryClient {
    getList = async (token, budgetId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/entry`, token);
    }

    create = async (token, type, lineId, member, description, date, amount) => {
        const apiClient = new ApiClient();
        var params = { type, lineId, member, description, date, amount};
        return await apiClient.post('/entry', params, token);
    }
}