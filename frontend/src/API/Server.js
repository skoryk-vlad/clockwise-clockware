import axios from 'axios';

// const API_URL = 'https://clockclock-back.herokuapp.com';
const API_URL = 'http://localhost:3001';


export default class Server {
    static async getCities() {
        const response = await axios.get(`${API_URL}/api/city`);
        return response.data;
    }
    static async addCity(name) {
        const response = await axios.post(`${API_URL}/api/city`, {
            params: {name}
        });
        return response.data;
    }
    static async deleteCityById(id) {
        const response = await axios.delete(`${API_URL}/api/city/${id}`);
        return response.data;
    }
    static async updateCityById(id, name) {
        const response = await axios.put(`${API_URL}/api/city`, {
            params: {
                id,
                name
            }
        });
        return response.data;
    }



    static async getMasters() {
        const response = await axios.get(`${API_URL}/api/master`);
        return response.data;
    }
    static async addMaster({name, rating, city_id}) {
        const response = await axios.post(`${API_URL}/api/master`, {
            params: {
                name,
                rating,
                city_id
            }
        });
        return response.data;
    }
    static async deleteMasterById(id) {
        const response = await axios.delete(`${API_URL}/api/master/${id}`);
        return response.data;
    }
    static async updateMasterById(id, {name, rating, city_id}) {
        const response = await axios.put(`${API_URL}/api/master`, {
            params: {
                id,
                name,
                rating,
                city_id
            }
        });
        return response.data;
    }



    static async getClients() {
        const response = await axios.get(`${API_URL}/api/client`);
        return response.data;
    }
    static async addClient({name, email}) {
        const response = await axios.post(`${API_URL}/api/client`, {
            params: {
                name,
                email
            }
        });
        return response.data;
    }
    static async deleteClientById(id) {
        const response = await axios.delete(`${API_URL}/api/client/${id}`);
        return response.data;
    }
    static async updateClientById(id, {name, email}) {
        const response = await axios.put(`${API_URL}/api/client`, {
            params: {
                id,
                name,
                email
            }
        });
        return response.data;
    }



    static async getOrders() {
        const response = await axios.get(`${API_URL}/api/order`);
        return response.data;
    }
    static async addOrder({client_id, master_id, city_id, watch_size, date, time}) {
        const response = await axios.post(`${API_URL}/api/order`, {
            params: {
                client_id,
                master_id,
                city_id,
                watch_size,
                date,
                time: parseInt(time)
            }
        });
        return response.data;
    }
    static async deleteOrderById(id) {
        const response = await axios.delete(`${API_URL}/api/order/${id}`);
        return response.data;
    }
    static async updateOrderById(id, {client_id, master_id, city_id, watch_size, date, time}) {
        const response = await axios.put(`${API_URL}/api/order`, {
            params: {
                id,
                client_id,
                master_id,
                city_id,
                watch_size,
                date,
                time: parseInt(time)
            }
        });
        return response.data;
    }

    static async getMastersByCity(city_id) {
        const response = await axios.get(`${API_URL}/api/master?city_id=${city_id}`);

        return response.data;
    }

    static async getOrdersByMasterAndDate({ city, date }) {
        const response = await axios.get(`${API_URL}/api/master?city_id=${city}`);

        
        return response.data;
    }

    static async addOrderAndClient(order) {
        const clientRes = await axios.post(`${API_URL}/api/client`,{
            params: {
                name: order.name,
                email: order.email
            }
        });

        const response = await axios.post(`${API_URL}/api/order`, {
            params: {
                client_id: clientRes.data.id,
                master_id: order.master_id,
                city_id: order.city,
                watch_size: order.watchSize,
                date: order.date,
                time: parseInt(order.time)
            }
        });
        return response.data;
    }


    static async auth(authInfo) {
        const response = await axios.post(`${API_URL}/auth`, {
            params: authInfo
        });
        return response.data;
    }
}