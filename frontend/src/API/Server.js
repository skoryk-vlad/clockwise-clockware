import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: `${API_URL}/api`
});

api.interceptors.request.use(config => {
    if (localStorage.getItem('token')) {
        config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }

    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401) {
        localStorage.removeItem('token');
        document.location.assign(`${document.location.origin}/admin/login`);
    }
    return Promise.reject(error.message);
});

export class CityService {
    static async getCities() {
        const { data } = await axios.get(`${API_URL}/api/city`);
        return data;
    }
    static async addCity(newCity) {
        const { data } = await api.post(`/city`, newCity);
        return data;
    }
    static async deleteCityById(id) {
        const { data } = await api.delete(`/city/${id}`);
        return data;
    }
    static async updateCityById(updCity) {
        const { data } = await api.put(`/city/${updCity.id}`, updCity);
        return data;
    }
}

export class MasterService {
    static async getMasters() {
        const { data } = await axios.get(`${API_URL}/api/master`);
        return data;
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
        const { data } = await api.put(`/master/${updMaster.id}`, updMaster);
        return data;
    }
    static async getFreeMasters(cityId, date, time, watchSize) {
        const { data } = await axios.get(`${API_URL}/api/freemasters?cityId=${cityId}&date=${date}&time=${time}&watchSize=${watchSize}`);
        return data;
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
        const { data } = await api.put(`/client/${updClient.id}`, updClient);
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
        const { data } = await api.put(`/order/${updOrder.id}`, updOrder);
        return data;
    }
    static async changeStatusById(id, status, rating) {
        const { data } = await api.post(`/order/status`, { id, status, rating });
        return data;
    }
}

export class AuthService {
    static async auth(authInfo) {
        try {
            const { data } = await axios.post(`${API_URL}/api/auth`, authInfo);
            return data;
        } catch (error) {
            return error;
        }
    }

    static async checkAuth() {
        const { data } = await api.get(`/admin`);
        return data;
    }
}
