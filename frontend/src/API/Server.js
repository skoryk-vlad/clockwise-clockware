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
    if (error.response.status === 401 && error.response.data === 'Token expired') {
        localStorage.removeItem('token');
        document.location.assign(document.location.origin);
    }
    return Promise.reject(error);
});

const createSearchParams = (attributes) => {
    Object.entries(attributes).forEach(attribute => {
        if ((!attribute[1] || (Array.isArray(attribute[1]) && attribute[1].length === 0)) && attribute[1] !== false) delete attributes[attribute[0]];
    });
    return new URLSearchParams(attributes);
};

export class CityService {
    static async getCities(attributes = {}) {
        const { data } = await api.get(`/city?${createSearchParams(attributes)}`);
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
    static async getMasters(attributes = {}) {
        const { data } = await api.get(`/master?${createSearchParams(attributes)}`);
        return data;
    }
    static async addMaster(newClient) {
        const { data } = await api.post(`/master/user`, newClient);
        return data;
    }
    static async addMasterByAdmin(newClient) {
        const { data } = await api.post(`/master/admin`, newClient);
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
        const { data } = await api.get(`/freemasters?cityId=${cityId}&date=${date}&time=${time}&watchSize=${watchSize}`);
        return data;
    }
    static async getMasterOrders(id, attributes = {}) {
        const { data } = await api.get(`/master/${id}/orders?${createSearchParams(attributes)}`);
        return data;
    }
}

export class ClientService {
    static async getClients(attributes = {}) {
        const { data } = await api.get(`/client?${createSearchParams(attributes)}`);
        return data;
    }
    static async getClientById(id) {
        const { data } = await api.get(`/client/${id}`);
        return data;
    }
    static async addClient(newClient) {
        const { data } = await api.post(`/client/user`, newClient);
        return data;
    }
    static async addClientByAdmin(newClient) {
        const { data } = await api.post(`/client/admin`, newClient);
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
    static async getClientOrders(id, attributes = []) {
        const { data } = await api.get(`/client/${id}/orders?${createSearchParams(attributes)}`);
        return data;
    }
}

export class OrderService {
    static async getOrders(attributes = []) {
        const { data } = await api.get(`/order?${createSearchParams(attributes)}`);
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
    static async changeStatusById(id, status) {
        const { data } = await api.post(`/order/status/${id}`, { status });
        return data;
    }
    static async setOrderRating(id, rating) {
        const { data } = await api.post(`/order/rating/${id}`, { rating });
        return data;
    }
    static async getMinAndMaxPrices() {
        const { data } = await api.get(`/order-min-max-prices`);
        return data;
    }
}
export class UserService {
    static async resetPassword(email) {
        const { data } = await api.post(`/user/password/reset/${email}`);
        return data;
    }
    static async createPassword(email) {
        const { data } = await api.post(`/user/password/create/${email}`);
        return data;
    }
    static async checkUserByEmail(email) {
        const { data } = await api.get(`/user/email/${email}`);
        return data;
    }
}

export class AuthService {
    static async auth(authInfo) {
        try {
            const { data } = await api.post(`/auth`, authInfo);
            return data;
        } catch (error) {
            return error;
        }
    }
}
