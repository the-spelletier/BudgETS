import { ApiClient } from "./ApiClient";

export class EntryClient {
    get = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/entry/${id}`, token);
    }

    getList = async (token, budgetId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/budget/${budgetId}/entry`, token);
    }

    create = async (token, lineId, description, date, amount, entryStatusId, memberId) => {
        const apiClient = new ApiClient();
        var params = { lineId, description, date, amount, entryStatusId, memberId};
        return await apiClient.post('/entry', params, token);
    }
    
    update = async (token, id, lineId, description, date, amount, entryStatusId, memberId) => {
        const apiClient = new ApiClient();
        var params = { lineId, description, date, amount, entryStatusId, memberId};
        return await apiClient.put(`/entry/${id}`, params, token);
    }

    delete = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/entry/${id}`, token);
    }
}