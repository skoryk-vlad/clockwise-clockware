import { encryptPassword } from './../src/password';
import { sequelize } from './../src/sequelize';
import { ROLES, User } from './../src/models/user.model';
import { WATCH_SIZES, ORDER_STATUSES, WatchSizes } from './../src/models/order.model';
import { CLIENT_STATUSES } from './../src/models/client.model';
import { MASTER_STATUSES } from './../src/models/master.model';
import { expect, describe, beforeAll, afterAll, it } from '@jest/globals';
import server from './index';

const adminInfo = {
    id: 100,
    email: `${process.env.ADMIN_LOGIN}`,
    password: encryptPassword(`${process.env.ADMIN_PASSWORD}`),
    role: ROLES.ADMIN,
    confirmationToken: '75ef8a10-04b9-4c66-ae7c-3097d0af5714'
};
const admin = {
    email: process.env.ADMIN_LOGIN, password: process.env.ADMIN_PASSWORD
};
const newMaster = {
    id: 1,
    name: 'Иван',
    email: 'ivanivanovich@gmail.com',
    password: 'ivanivanovich',
    cities: [1],
    status: MASTER_STATUSES.APPROVED
};
const newMaster2 = {
    id: 2,
    name: 'Богдан',
    email: 'bogomdan@gmail.com',
    password: 'sdf32Sggt278',
    cities: [2],
    status: MASTER_STATUSES.NOT_CONFIRMED
};
const newCity = {
    id: 1,
    name: 'Днепр',
    price: 120
};
const newCity2 = {
    id: 2,
    name: 'Киев',
    price: 150
};
const newClient = {
    id: 1,
    name: 'Станислав',
    email: 'stanislove99@ukr.net',
    password: 'apsspassword',
    status: CLIENT_STATUSES.CONFIRMED
}
const newOrder = {
    id: 1,
    name: newClient.name,
    email: newClient.email,
    masterId: newMaster.id,
    cityId: newCity.id,
    watchSize: WATCH_SIZES.MEDIUM,
    date: '2022-11-15',
    time: 12,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};
const newOrderWithoutRequiredFields = {
    name: newClient.name,
    email: newClient.email,
    watchSize: WATCH_SIZES.MEDIUM,
    date: '2022-08-15',
    status: ORDER_STATUSES.AWAITING_PAYMENT
};
const newOrderWithWrongFields = {
    name: newClient.name,
    email: newClient.email,
    masterId: 'stepan',
    cityId: 'dnipro',
    watchSize: 1,
    date: '2022-11-15',
    time: 12,
    status: 'oplachen'
};
const newOrderWithTimeError = {
    name: newClient.name,
    email: newClient.email,
    masterId: newMaster.id,
    cityId: newCity.id,
    watchSize: WATCH_SIZES.BIG,
    date: '2022-11-15',
    time: 17,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};
const newOrderWithWrongFields2 = {
    name: newClient.name,
    email: newClient.email,
    masterId: newMaster.id,
    cityId: newCity.id,
    date: '2022-11-32',
    time: 17,
};
const newOrderWithWrongCityMaster = {
    name: newClient.name,
    email: newClient.email,
    masterId: newMaster.id,
    cityId: newCity2.id,
    watchSize: WATCH_SIZES.MEDIUM,
    date: '2022-11-25',
    time: 12,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};

let token = '';

describe("ORDER API", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        await User.create(adminInfo);
        const auth = await server.post('/api/auth').send(admin);
        token = auth.body.token;

        await server.post("/api/city").set('Authorization', `Bearer ${token}`).send(newCity);
        await server.post("/api/city").set('Authorization', `Bearer ${token}`).send(newCity2);
        await server.post("/api/client/user").set('Authorization', `Bearer ${token}`).send(newClient);
        await server.post("/api/master/user").set('Authorization', `Bearer ${token}`).send(newMaster);
        await server.post("/api/master/user").set('Authorization', `Bearer ${token}`).send(newMaster2);
    })

    afterAll(async () => {
        await sequelize.sync({ force: true });
    })

    describe("POST /api/order", () => {
        it("should add order and return it", async () => {
            const response = await server
                .post("/api/order")
                .send(newOrder)
                .expect("Content-Type", /json/)
                .expect(201);

            const { id, clientId, masterId, date, time, watchSize, rating, status, endTime, price, review } = response.body;
            expect(id).toBe(newOrder.id);
            expect(clientId).toBe(newClient.id);
            expect(masterId).toBe(newOrder.masterId);
            expect(date).toBe(newOrder.date);
            expect(time).toBe(newOrder.time);
            expect(watchSize).toBe(newOrder.watchSize);
            expect(rating).toBe(0);
            expect(status).toBe(newOrder.status);
            expect(endTime).toBe(newOrder.time + Number(WatchSizes[newOrder.watchSize]));
            expect(price).toBe(Number(WatchSizes[newOrder.watchSize]) * newCity.price);
            expect(review).toBeNull();
        });
        it("should return error that order overlaps with others", async () => {
            await server
                .post("/api/order")
                .send(newOrder)
                .expect("Content-Type", /json/)
                .expect(400)
                .expect('"The order overlaps with others. Select another master, date or time"');
        });
        it("should return error that order does not have required fields", async () => {
            const response = await server
                .post("/api/order")
                .send(newOrderWithoutRequiredFields)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(3);
            expect(response.body[0]).toHaveProperty("path", ["time"]);
            expect(response.body[0]).toHaveProperty("message", "Required");
            expect(response.body[1]).toHaveProperty("path", ["masterId"]);
            expect(response.body[1]).toHaveProperty("message", "Required");
            expect(response.body[2]).toHaveProperty("path", ["cityId"]);
            expect(response.body[2]).toHaveProperty("message", "Required");
        });
        it("should return error that order has fields in wrong format", async () => {
            const response = await server
                .post("/api/order")
                .send(newOrderWithWrongFields)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(4);
            expect(response.body[0]).toHaveProperty("path", ["watchSize"]);
            expect(response.body[0]).toHaveProperty("message", "Invalid enum value. Expected 'small' | 'medium' | 'big', received '1'");
            expect(response.body[1]).toHaveProperty("path", ["masterId"]);
            expect(response.body[1]).toHaveProperty("message", "Expected number, received nan");
            expect(response.body[2]).toHaveProperty("path", ["cityId"]);
            expect(response.body[2]).toHaveProperty("message", "Expected number, received nan");
            expect(response.body[3]).toHaveProperty("path", ["status"]);
            expect(response.body[3]).toHaveProperty("message", "Invalid enum value. Expected 'awaiting payment' | 'paid' | 'completed' | 'canceled', received 'oplachen'");
        });
        it("should return error that order has time issues", async () => {
            const response = await server
                .post("/api/order")
                .send(newOrderWithTimeError)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty("path", ["time"]);
            expect(response.body[0]).toHaveProperty("message", "Wrong time or watch size selected");
            expect(response.body[1]).toHaveProperty("path", ["watchSize"]);
            expect(response.body[1]).toHaveProperty("message", "Wrong time or watch size selected");
        });
        it("should return error that order has wrong fields", async () => {
            const response = await server
                .post("/api/order")
                .send(newOrderWithWrongFields2)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(3);
            expect(response.body[0]).toHaveProperty("path", ["watchSize"]);
            expect(response.body[0]).toHaveProperty("message", "Required");
            expect(response.body[1]).toHaveProperty("path", ["date"]);
            expect(response.body[1]).toHaveProperty("message", "Invalid date");
            expect(response.body[2]).toHaveProperty("path", ["status"]);
            expect(response.body[2]).toHaveProperty("message", "Required");
        });
        it("should return error that master not work in this city", async () => {
            await server
                .post("/api/order")
                .send(newOrderWithWrongCityMaster)
                .expect("Content-Type", /json/)
                .expect(404)
                .expect('"No such city and master relation"');
        });
    });
});