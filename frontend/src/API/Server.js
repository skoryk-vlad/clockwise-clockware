import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: `${API_URL}/api`
});

api.interceptors.request.use(config => {
    if(localStorage.getItem('token')){
        config.headers['Authorization'] = 'Bearer '+ localStorage.getItem('token');
    }
    
    return config;
}, error => {
    return Promise.reject(error);
});

export class CityService {
    static async getCities() {
        const response = await axios.get(`${API_URL}/api/city`);
        return response.data;
    }
    static async addCity(name) {
        const { data } = await api.post(`/city`, { name });
        return data;
    }
    static async deleteCityById(id) {
        const { data } = await api.delete(`/city/${id}`);
        return data;
    }
    static async updateCityById(id, name) {
        const { data } = await api.put(`/city`, { id, name });
        return data;
    }
}

export class MasterService {
    static async getMasters() {
        const response = await axios.get(`${API_URL}/api/master`);
        return response.data;
    }
    static async addMaster(newMaster) {
        const { data } = await api.post(`/master`, newMaster);
        return data;
    }
    static async deleteMasterById(id) {
        const { data } = await api.delete(`/master/${id}`);
        return data;
    }
    static async updateMasterById(updMaster) {
        const { data } = await api.put(`/master`, updMaster);
        return data;
    }
    static async getAvailableMasters(cityId, date, time, watchSize) {
        const response = await axios.get(`${API_URL}/api/availmaster?cityId=${cityId}&date=${date}&time=${time}&watchSize=${watchSize}`);
        return response.data;
    }
}

export class ClientService {
    static async getClients() {
        const { data } = await api.get(`/client`);
        return data;
    }
    static async addClient(newClient) {
        const { data } = await api.post(`/client`, newClient);
        return data;
    }
    static async deleteClientById(id) {
        const { data } = await api.delete(`/client/${id}`);
        return data;
    }
    static async updateClientById(updClient) {
        const { data } = await api.put(`/client`, updClient);
        return data;
    }
}

export class OrderService {
    static async getOrders() {
        const { data } = await api.get(`/order`);
        return data;
    }
    static async addOrder(newOrder) {
        const { data } = await api.post(`/order`, newOrder);
        return data;
    }
    static async deleteOrderById(id) {
        const { data } = await api.delete(`/order/${id}`);
        return data;
    }
    static async updateOrderById(updOrder) {
        const { data } = await api.put(`/order`, updOrder);
        return data;
    }
    static async changeStatusById(id, statusId, rating) {
        const { data } = await api.post(`/order/status`, { id, statusId, rating });
        return data;
    }
}

export class AuthService {
    static async auth(authInfo) {
        try {
            const response = await axios.post(`${API_URL}/api/auth`, authInfo);
            return response.data;
        } catch (e) {
            return e;
        }
    }

    static async checkAuth() {
        const { data } = await api.get(`/admin`);
        return data;
    }
}

export class StatusService {
    static async getStatuses() {
        const { data } = await api.get(`/status`);
        return data;
    }
}
