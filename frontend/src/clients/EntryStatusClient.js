import { ApiClient } from "./ApiClient";

export class EntryStatusClient {
    getAll = async (token) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/status`, token);
    }
}