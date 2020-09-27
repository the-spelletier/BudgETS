import { ApiClient } from './ApiClient';

export class BudgetClient {

    list = async (username, password) => {
        const apiClient = new ApiClient();
        return await apiClient.get('/budget');
    }
};