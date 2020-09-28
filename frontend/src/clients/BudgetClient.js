import { ApiClient } from './ApiClient';

export class BudgetClient {

    list = async (token) => {
        const apiClient = new ApiClient();
        return await apiClient.get('/budget', token);
    }
};