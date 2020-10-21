import { ApiClient } from './ApiClient';

export class LineClient {
    getAll = async (token, categoryId) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/category/${categoryId}/line`, token);
    }

    create = async (token, name, description, estimate, categoryId) => {
        const apiClient = new ApiClient();
        var params = { name, description, estimate, categoryId };
        return await apiClient.post('/line', params, token);
    }

    update = async (token, id, name, description, estimate, categoryId) => {
        const apiClient = new ApiClient();
        var params = { name, description, estimate, categoryId };
        return await apiClient.put(`/line/${id}`, params, token);
    }

    delete = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/line/${id}`, token);
    }
}