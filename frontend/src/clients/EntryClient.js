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

    create = async (token, lineId, member, description, date, amount, entryStatusId) => {
        const apiClient = new ApiClient();
        //TODO : remove hard coded value
        var params = { type: "revenue", lineId, member, description, date, amount, entryStatusId};
        return await apiClient.post('/entry', params, token);
    }
    
    update = async (token, id, lineId, member, description, date, amount, entryStatusId) => {
        const apiClient = new ApiClient();
        var params = { lineId, member, description, date, amount, entryStatusId};
        return await apiClient.put(`/entry/${id}`, params, token);
    }

    delete = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/entry/${id}`, token);
    }
}