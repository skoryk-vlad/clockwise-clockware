import axios from 'axios';

export default class Server {
    static async getCities() {
        const response = await axios.get('/api/city');
        return response.data;
    }
    static async addCity(name) {
        const response = await axios.post(`/api/city`, {
            params: {name}
        });
        return response.data;
    }
    static async deleteCityById(id) {
        const response = await axios.delete(`/api/city/${id}`);
        return response.data;
    }
    static async updateCityById(id, name) {
        const response = await axios.put(`/api/city`, {
            params: {
                id,
                name
            }
        });
        return response.data;
    }



    static async getMasters() {
        const response = await axios.get('/api/master');
        return response.data;
    }
    static async addMaster({name, rating, city_id}) {
        const response = await axios.post(`/api/master`, {
            params: {
                name,
                rating,
                city_id
            }
        });
        return response.data;
    }
    static async deleteMasterById(id) {
        const response = await axios.delete(`/api/master/${id}`);
        return response.data;
    }
    static async updateMasterById(id, {name, rating, city_id}) {
        const response = await axios.put(`/api/master`, {
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
        const response = await axios.get('/api/client');
        return response.data;
    }
    static async addClient({name, email}) {
        const response = await axios.post(`/api/client`, {
            params: {
                name,
                email
            }
        });
        return response.data;
    }
    static async deleteClientById(id) {
        const response = await axios.delete(`/api/client/${id}`);
        return response.data;
    }
    static async updateClientById(id, {name, email}) {
        const response = await axios.put(`/api/client`, {
            params: {
                id,
                name,
                email
            }
        });
        return response.data;
    }



    static async getOrders() {
        const response = await axios.get('/api/order');
        return response.data;
    }
    static async addOrder({client_id, master_id, city_id, watch_size, date, time}) {
        const response = await axios.post(`/api/order`, {
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
        const response = await axios.delete(`/api/order/${id}`);
        return response.data;
    }
    static async updateOrderById(id, {client_id, master_id, city_id, watch_size, date, time}) {
        const response = await axios.put(`/api/order`, {
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



    static async addOrderAndClient(order) {
        const clientRes = await axios.post(`/api/client`,{
            params: {
                name: order.name,
                email: order.email
            }
        });

        const response = await axios.post(`/api/order`, {
            params: {
                client_id: clientRes.data.id,
                master_id: 1,
                // city_id: Number(order.city),
                // watch_size: Number(order.watchSize),
                // date: new Date(order.date),
                // time: parseInt(order.time)
                city_id: order.city,
                watch_size: order.watchSize,
                date: order.date,
                time: parseInt(order.time)
            }
        });
        return response.data;
    }
}