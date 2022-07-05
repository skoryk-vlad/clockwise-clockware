import axios from 'axios';

const API_URL = 'https://clockclock-back.herokuapp.com';
// const API_URL = 'http://localhost:3001';


export class CityService {
    static async getCities() {
        const response = await axios.get(`${API_URL}/api/city`);
        return response.data;
    }
    static async addCity(name, token) {
        const response = await axios.post(`${API_URL}/api/city`, {name}, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async deleteCityById(id, token) {
        const response = await axios.delete(`${API_URL}/api/city/${id}`, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async updateCityById(id, name, token) {
        const response = await axios.put(`${API_URL}/api/city`, { id, name }, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
}

export class MasterService {
    static async getMasters() {
        const response = await axios.get(`${API_URL}/api/master`);
        return response.data;
    }
    static async addMaster(newMaster, token) {
        const response = await axios.post(`${API_URL}/api/master`, newMaster, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async deleteMasterById(id, token) {
        const response = await axios.delete(`${API_URL}/api/master/${id}`, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async updateMasterById(updMaster, token) {
        const response = await axios.put(`${API_URL}/api/master`, updMaster, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async getMastersByCity(city_id) {
        const response = await axios.get(`${API_URL}/api/master?city_id=${city_id}`);
        return response.data;
    }
    static async getAvailableMasters(city_id, date, time, watch_size) {
        const response = await axios.get(`${API_URL}/api/availmaster?city_id=${city_id}&date=${date}&time=${time}&watch_size=${watch_size}`);
        return response.data;
    }
}

export class ClientService {
    static async getClients(token) {
        const response = await axios.get(`${API_URL}/api/client`, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async addClient(newClient, token) {
        const response = await axios.post(`${API_URL}/api/client`, newClient, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async deleteClientById(id, token) {
        const response = await axios.delete(`${API_URL}/api/client/${id}`, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async updateClientById(updClient, token) {
        const response = await axios.put(`${API_URL}/api/client`, updClient, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
}

export class OrderService {
    static async getOrders(token) {
        const response = await axios.get(`${API_URL}/api/order`, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async addOrder(newOrder, token) {
        const response = await axios.post(`${API_URL}/api/order`, newOrder, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async deleteOrderById(id, token) {
        const response = await axios.delete(`${API_URL}/api/order/${id}`, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async updateOrderById(updOrder, token) {
        const response = await axios.put(`${API_URL}/api/order`, updOrder, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }
    static async completeOrderById(id, token) {
        const response = await axios.post(`${API_URL}/api/order/complete`, {id}, {
            headers: {
            'Authorization': 'Bearer ' + token
        }});
        return response.data;
    }

    static async addOrderAndClient(order) {
        const response = await axios.post(`${API_URL}/api/order/client`, order);
        
        return response.data;
    }
}

export class AuthService {
    static async auth(authInfo) {
        try{
            const response = await axios.post(`${API_URL}/api/auth`, authInfo);
            return response.data;
        } catch(e) {
            return e;
        }
    }

    static async checkAuth(token) {
        const response = await axios.get(`${API_URL}/api/admin`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        return response.data;
    }
}

// export default class Server {

//     static async getOrdersByMasterAndDate({ city, date }) {
//         const response = await axios.get(`${API_URL}/api/master?city_id=${city}`);

//         return response.data;
//     }
// }