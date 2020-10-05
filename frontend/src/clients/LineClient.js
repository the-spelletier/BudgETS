import { ApiClient } from './ApiClient';

export class LineClient {
    create = async (token, name, description, estimate, categoryId) => {
        const apiClient = new ApiClient();
        var params = { name, description, estimate, categoryId };
        return await apiClient.post('/line', params, token);
    }
}