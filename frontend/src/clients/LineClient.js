import { ApiClient } from './ApiClient';

export class LineClient {
    create = async (token, name, description, expenseEstimate, categoryId) => {
        const apiClient = new ApiClient();
        var params = { name, description, expenseEstimate, categoryId };
        return await apiClient.post('/line', params, token);
    }

    update = async (token, id, name, description, expenseEstimate, categoryId) => {
        const apiClient = new ApiClient();
        var params = { name, description, expenseEstimate, categoryId };
        return await apiClient.put(`/line/${id}`, params, token);
    }

    delete = async (token, id) => {
        const apiClient = new ApiClient();
        return await apiClient.delete(`/line/${id}`, token);
    }
}