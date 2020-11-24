import { ApiClient } from './ApiClient';

export class UserClient {

    getAll = async (token) => {
        const apiClient = new ApiClient();
        return await apiClient.get(`/users`, token);
    }
}