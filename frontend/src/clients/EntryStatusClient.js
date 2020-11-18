import { ApiClient } from "./ApiClient";

export class EntryStatusClient {
    get = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/status/${id}`, token);
    }
    
    getAll = async (token) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/status`, token);
    }
}