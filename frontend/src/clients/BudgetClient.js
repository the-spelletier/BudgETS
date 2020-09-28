import { ApiClient } from './ApiClient';

export class BudgetClient {

    list = async (token) => {
        const apiClient = new ApiClient();
        return await apiClient.get('/budget', token);
    }

    create = async (token, name, startDate, endDate, isActive) => {
        const apiClient = new ApiClient();
        var params = {name, startDate, endDate, isActive};
        return await apiClient.post('/budget', params, token);
    }
};