import { ApiClient } from './ApiClient';

export class AuthClient {

    login = async (username, password) => {
        const apiClient = new ApiClient();
        var params = { username, password };
        return await apiClient.post('/auth', params)
    }
};