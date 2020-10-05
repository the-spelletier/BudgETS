import { ApiClient } from './ApiClient';

export class CategoryClient {
    create = async (token, budgetId, name, type) => {
        const apiClient = new ApiClient();
        var params = {budgetId, name, type};
        return await apiClient.post('/category', params, token);
    }
}