import { encryptPassword } from './../src/password';
import { User, ROLES } from './../src/models/user.model';
import { AUTH_SERVICES } from '../src/types';
import { WATCH_SIZES, ORDER_STATUSES } from '../src/models/order.model';
import { CLIENT_STATUSES } from '../src/models/client.model';
import { MASTER_STATUSES } from '../src/models/master.model';
import { expect, describe, beforeAll, afterAll, it } from '@jest/globals';
import server from './index';
import { sequelize } from '../src/sequelize';

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
    cities: [1, 2],
    status: MASTER_STATUSES.NOT_CONFIRMED
};
const newMaster3 = {
    id: 3,
    name: 'Арсений',
    email: 'arsen4ik@gmail.com',
    password: '1ff3gafdtv58',
    cities: [2],
    status: MASTER_STATUSES.NOT_CONFIRMED
};
const newMaster4 = {
    id: 4,
    name: 'Светлана',
    email: 'semisvetik123@gmail.com',
    cities: [2],
    status: MASTER_STATUSES.NOT_CONFIRMED
};
const newMasterByService = {
    id: 15,
    token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxM2ZkNjhjOTY2ZTI5MzgwOTgxZWRjMDE2NGEyZjZjMDZjNTcwMmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NjgxNTgxNTQsImF1ZCI6IjEwNjY3NDQ3NDk4MTMtOTh2Nzk1YmplM2M2aWw4NmRpM3FiNzYwbDRjZnQyamIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTAyMjU4NjA2MDk0NjQ1MDk0MTYiLCJlbWFpbCI6InZtczA3MDMwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMTA2Njc0NDc0OTgxMy05OHY3OTViamUzYzZpbDg2ZGkzcWI3NjBsNGNmdDJqYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJWbGFkIEtyYW1lciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BTG01d3UyR2UxMlN0NHl5TUZEVmJYZV9hemJxOGxmdTQtTHlTcFUzZm9qQj1zOTYtYyIsImdpdmVuX25hbWUiOiJWbGFkIiwiZmFtaWx5X25hbWUiOiJLcmFtZXIiLCJpYXQiOjE2NjgxNTg0NTQsImV4cCI6MTY2ODE2MjA1NCwianRpIjoiNmU4NTI3NWMxNWYzNjEzZTkyNDFhNTEyN2ZmYjk0OTE3ODZhMGVlYSJ9.f3U7SaNsUzGr19P4PjaxQsur7dr4HNgqrZdFk-ZXH-sFsBC09RgL4MoZO5QNPJt4wnfRfDE1qKP33yIpvDaYGKHvQYZTGGSDdwvoYOkKFpnmtUXU5pskMhg07I94wpb1H76ZC_R1PZ2niRlXVAcop4vJzpWX6rukzYeIDQyT2ADXL8GiGhGhWSE8MycLevB3dvOE26q9N9ICrQcQmZVm789vkNeHmSfP0orifvzshhM0jUlK2DFL2VoNKfbLalsFSXP0zTec-OvnpCcPRQP0Ym3bvnosTgQx4a6lLcu_EtPgpMcwl8hiJR1Sa3KWJ2I9SAtNj_G9P0_VZOldDZp-rQ",
    service: AUTH_SERVICES.GOOGLE,
    cities: [1]
};
const newMasterByServiceExpiredToken = {
    token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxM2ZkNjhjOTY2ZTI5MzgwOTgxZWRjMDE2NGEyZjZjMDZjNTcwMmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NjgwNjU0NDUsImF1ZCI6IjEwNjY3NDQ3NDk4MTMtOTh2Nzk1YmplM2M2aWw4NmRpM3FiNzYwbDRjZnQyamIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTAyMjU4NjA2MDk0NjQ1MDk0MTYiLCJlbWFpbCI6InZtczA3MDMwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMTA2Njc0NDc0OTgxMy05OHY3OTViamUzYzZpbDg2ZGkzcWI3NjBsNGNmdDJqYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJWbGFkIEtyYW1lciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BTG01d3UyR2UxMlN0NHl5TUZEVmJYZV9hemJxOGxmdTQtTHlTcFUzZm9qQj1zOTYtYyIsImdpdmVuX25hbWUiOiJWbGFkIiwiZmFtaWx5X25hbWUiOiJLcmFtZXIiLCJpYXQiOjE2NjgwNjU3NDUsImV4cCI6MTY2ODA2OTM0NSwianRpIjoiMGJlMmJlYTc3OGFkY2U3YjUwN2YwMjQ2YThmYjE0ODFkMmYyMDZmZSJ9.BqwdSUP8vtMTATdGzmcK4e9s0lPYzzb6WEpSVvZbRZhOaegQlpn1RgywcolA1g2gLf2IHdOMWf7KeuQQFdVWaiYqnNJY87bjOlFvRBAxFi__lMK7erHlJ7fzH1Hw8PQt9nabnhv25umd6hljkJ3_Ku0ITXwFx-7MPrtmBntPMY5YXHpiRhKI12TslNUp2stxAozeXDcuKsxO4l4zaOtgVaNpmklCbC-bHjFJnx_aMWnt2wcxTQtFQyHcLQR4_WyAU0D0Dbea7yJqMVbGYtNjDYe_PLCi5Qt_hCcuioVwy_bzHgL4c6l7wHSGXpBHiQwj3VN_K3QoVYbJHkQxqisixQ',
    service: AUTH_SERVICES.GOOGLE,
    cities: [1]
};
const newMasterByServiceWrongToken = {
    token: 'eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJ',
    service: AUTH_SERVICES.GOOGLE,
    cities: [1]
};
const newMasterByServiceWrongService = {
    token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxM2ZkNjhjOTY2ZTI5MzgwOTgxZWRjMDE2NGEyZjZjMDZjNTcwMmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NjgwNjU0NDUsImF1ZCI6IjEwNjY3NDQ3NDk4MTMtOTh2Nzk1YmplM2M2aWw4NmRpM3FiNzYwbDRjZnQyamIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTAyMjU4NjA2MDk0NjQ1MDk0MTYiLCJlbWFpbCI6InZtczA3MDMwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMTA2Njc0NDc0OTgxMy05OHY3OTViamUzYzZpbDg2ZGkzcWI3NjBsNGNmdDJqYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJWbGFkIEtyYW1lciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BTG01d3UyR2UxMlN0NHl5TUZEVmJYZV9hemJxOGxmdTQtTHlTcFUzZm9qQj1zOTYtYyIsImdpdmVuX25hbWUiOiJWbGFkIiwiZmFtaWx5X25hbWUiOiJLcmFtZXIiLCJpYXQiOjE2NjgwNjU3NDUsImV4cCI6MTY2ODA2OTM0NSwianRpIjoiMGJlMmJlYTc3OGFkY2U3YjUwN2YwMjQ2YThmYjE0ODFkMmYyMDZmZSJ9.BqwdSUP8vtMTATdGzmcK4e9s0lPYzzb6WEpSVvZbRZhOaegQlpn1RgywcolA1g2gLf2IHdOMWf7KeuQQFdVWaiYqnNJY87bjOlFvRBAxFi__lMK7erHlJ7fzH1Hw8PQt9nabnhv25umd6hljkJ3_Ku0ITXwFx-7MPrtmBntPMY5YXHpiRhKI12TslNUp2stxAozeXDcuKsxO4l4zaOtgVaNpmklCbC-bHjFJnx_aMWnt2wcxTQtFQyHcLQR4_WyAU0D0Dbea7yJqMVbGYtNjDYe_PLCi5Qt_hCcuioVwy_bzHgL4c6l7wHSGXpBHiQwj3VN_K3QoVYbJHkQxqisixQ',
    service: 'twitter',
    cities: [1]
};
const newMasterErrorCity = {
    id: 5,
    name: 'Степан',
    email: 'stepanh123@gmail.com',
    password: 'stepanh123',
    cities: [1, 3],
    status: MASTER_STATUSES.CONFIRMED
};
const newMasterErrorEmail = {
    id: 6,
    name: 'Степан',
    email: 'stepanh123com',
    password: 'stepanh123',
    cities: [1, 2],
    status: MASTER_STATUSES.CONFIRMED
};
const newMasterError = {
    id: 7,
    name: 'Степан',
    cities: [1, 2],
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
    date: '2022-08-15',
    time: 12,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};
const newOrder2 = {
    id: 2,
    name: newClient.name,
    email: newClient.email,
    masterId: newMaster.id,
    cityId: newCity.id,
    watchSize: WATCH_SIZES.BIG,
    date: '2022-08-15',
    time: 10,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};
const newOrder3 = {
    id: 3,
    name: newClient.name,
    email: newClient.email,
    masterId: newMaster.id,
    cityId: newCity.id,
    watchSize: WATCH_SIZES.BIG,
    date: '2022-08-16',
    time: 10,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};
const newOrder4 = {
    id: 4,
    name: newClient.name,
    email: newClient.email,
    masterId: newMaster2.id,
    cityId: newCity.id,
    watchSize: WATCH_SIZES.BIG,
    date: '2022-08-17',
    time: 10,
    status: ORDER_STATUSES.COMPLETED
};
const newReview = {
    rating: 5,
    review: 'Спасибо. Заказ выполнен бомбически!!!'
}
const newCity3 = {
    id: 3,
    name: 'Полтава',
    price: 100
};
const newClient2 = {
    id: 2,
    name: 'Арсен',
    email: 'cenyaarsen@google.com',
    password: 'ssapwoparssd',
    status: CLIENT_STATUSES.CONFIRMED
}
const newMaster20 = {
    id: 20,
    name: 'Владимир',
    email: 'vladimir73927@gmail.com',
    password: 'sdfSggt27832',
    cities: [3],
    status: MASTER_STATUSES.NOT_CONFIRMED
};
const newMaster21 = {
    id: 21,
    name: 'Владимир',
    email: 'vladimir73@gmail.com',
    password: 'sdfSggt27832',
    cities: [3],
    status: MASTER_STATUSES.NOT_CONFIRMED
};
const newOrder5 = {
    id: 5,
    name: newClient2.name,
    email: newClient2.email,
    masterId: newMaster20.id,
    cityId: newCity3.id,
    watchSize: WATCH_SIZES.BIG,
    date: '2022-08-21',
    time: 10,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};

let token = '';

describe("MASTER API", () => {
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

    describe("POST /api/master/user", () => {
        afterAll(async () => {
            await server.delete(`/api/master/${newMaster3.id}`).set('Authorization', `Bearer ${token}`);
        })
        it("should add master", async () => {
            const response = await server
                .post("/api/master/user")
                .send(newMaster3)
                .expect("Content-Type", /json/)
                .expect(201);

            const { id, name, email, cities, status } = response.body;
            expect(id).toBe(newMaster3.id);
            expect(name).toBe(newMaster3.name);
            expect(email).toBe(newMaster3.email);
            expect(cities).toHaveLength(newMaster3.cities.length);
            expect(status).toBe(newMaster3.status);
        });
        it("should return error that user already registered", async () => {
            await server
                .post("/api/master/user")
                .send(newMaster3)
                .expect("Content-Type", /json/)
                .expect(409)
                .expect('"User with this email exist"');
        });
        it("should return error that city does not exist", async () => {
            await server
                .post("/api/master/user")
                .send(newMasterErrorCity)
                .expect("Content-Type", /json/)
                .expect(404)
                .expect('"Some of the cities does not exist"');
        });
        it("should return error that user has wrong email format", async () => {
            const response = await server
                .post("/api/master/user")
                .send(newMasterErrorEmail)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty("validation", "email");
            expect(response.body[0]).toHaveProperty("message", "Invalid email");
        });
    });

    describe("POST /api/master/service", () => {
        let id = null;
        it("should add master", async () => {
            const response = await server
                .post("/api/master/service")
                .send(newMasterByService)
                .expect("Content-Type", /json/)
                .expect(201);

            id = response.body.id;
            expect(response.body.cities).toHaveLength(newMasterByService.cities.length);
            expect(response.body.status).toBe(MASTER_STATUSES.CONFIRMED);
        });
        it("should return error that token expired", async () => {
            await server
                .post("/api/master/service")
                .send(newMasterByServiceExpiredToken)
                .expect("Content-Type", /json/)
                .expect(400)
                .expect(`"Token used too late"`);
        });
        it("should return error that token in wrong format", async () => {
            await server
                .post("/api/master/service")
                .send(newMasterByServiceWrongToken)
                .expect("Content-Type", /json/)
                .expect(400)
                .expect(`"Wrong number of segments in token: ${newMasterByServiceWrongToken.token}"`);
        });
        it("should return error that service not exist", async () => {
            const response = await server
                .post("/api/master/service")
                .send(newMasterByServiceWrongService)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body[0]).toHaveProperty("path", ["service"]);
            expect(response.body[0]).toHaveProperty("message", "Invalid enum value. Expected 'google' | 'facebook', received 'twitter'");
        });
        afterAll(async () => {
            await server.delete(`/api/master/${id}`).set('Authorization', `Bearer ${token}`);
        })
    });

    describe("POST /api/master/admin", () => {
        afterAll(async () => {
            await server.delete(`/api/master/${newMaster4.id}`).set('Authorization', `Bearer ${token}`);
        })
        it("should add master", async () => {
            const response = await server
                .post("/api/master/admin")
                .send(newMaster4)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(201);

            const { id, name, email, cities, status } = response.body;
            expect(id).toBe(newMaster4.id);
            expect(name).toBe(newMaster4.name);
            expect(email).toBe(newMaster4.email);
            expect(cities).toHaveLength(newMaster4.cities.length);
            expect(status).toBe(newMaster4.status);
        });
        it("should return error that master does not have required fields", async () => {
            const response = await server
                .post("/api/master/admin")
                .send(newMasterError)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty("path", ["email"]);
            expect(response.body[0]).toHaveProperty("message", "Required");
            expect(response.body[1]).toHaveProperty("path", ["status"]);
            expect(response.body[1]).toHaveProperty("message", "Required");
        });
        it("should return error that user has wrong email format", async () => {
            const response = await server
                .post("/api/master/admin")
                .send(newMasterErrorEmail)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty("validation", "email");
            expect(response.body[0]).toHaveProperty("message", "Invalid email");
        });
    });

    describe("GET /api/master", () => {
        it("should return masters", async () => {
            const response = await server
                .get("/api/master?sortedField=id&isDirectedASC=true")
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.count).toBe(2);

            const { id, name, email, Cities } = response.body.rows[0];
            expect(id).toBe(newMaster.id);
            expect(name).toBe(newMaster.name);
            expect(email).toBe(newMaster.email);
            expect(Cities).toHaveLength(newMaster.cities.length);

            const { id: cityId, name: cityName, price } = Cities[0];
            expect(cityId).toBe(newCity.id);
            expect(cityName).toBe(newCity.name);
            expect(price).toBe(newCity.price);
        });
        it("should return limited masters", async () => {
            const response = await server
                .get("/api/master?limit=1&page=1")
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.count).toBe(2);
            expect(response.body.rows.length).toBe(1);
        });
        it("should return error with query params", async () => {
            const response = await server
                .get("/api/master?sortedField=field&statuses=ready&cities=1,2,dnipro")
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(3);
            expect(response.body[0]).toHaveProperty("message", "Expected number, received nan");
            expect(response.body[1]).toHaveProperty("message", "Invalid enum value. Expected 'not confirmed' | 'confirmed' | 'approved', received 'ready'");
            expect(response.body[2]).toHaveProperty("message", "Invalid input");
        });
    });

    describe("GET /api/master/:id", () => {
        it("should return master by id", async () => {
            const response = await server
                .get(`/api/master/${newMaster2.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200);

            const { id, name, email, Cities } = response.body;
            expect(id).toBe(newMaster2.id);
            expect(name).toBe(newMaster2.name);
            expect(email).toBe(newMaster2.email);
            expect(Cities).toHaveLength(newMaster2.cities.length);
        });
        it("should return error that master does not exist", async () => {
            await server
                .get("/api/master/10")
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(404)
                .expect('"No such master"');
        });
        it("should return error that id must be a number", async () => {
            const response = await server
                .get("/api/master/master")
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('message', 'Expected number, received nan');
        });
    });

    describe("GET /api/freemasters", () => {
        it("should return all free masters", async () => {
            const response = await server
                .get(`/api/freemasters?cityId=${newOrder.cityId}&date=${newOrder.date}&time=${newOrder.time}&watchSize=${newOrder.watchSize}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id', 1);
            expect(response.body[1]).toHaveProperty('id', 2);
        });
        it("should return 1 free master", async () => {
            await server.post('/api/order').send(newOrder);

            const response = await server
                .get(`/api/freemasters?cityId=${newOrder2.cityId}&date=${newOrder2.date}&time=${newOrder2.time}&watchSize=${newOrder2.watchSize}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('id', 2);
        });
        it("should return error with query params", async () => {
            const response = await server
                .get(`/api/freemasters?cityId=${newOrder2.cityId}&date=${newOrder2.date}&time=8&watchSize=verybig`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty("message", "Invalid enum value. Expected 'small' | 'medium' | 'big', received 'verybig'");
            expect(response.body[1]).toHaveProperty("message", "Number must be greater than or equal to 10");
        });
        it("should return masters by rating", async () => {
            await server.post(`/api/order/status/${newOrder.id}`).set('Authorization', `Bearer ${token}`).send({ status: ORDER_STATUSES.COMPLETED });
            await server.post(`/api/order/rating/${newOrder.id}`).set('Authorization', `Bearer ${token}`).send({ rating: 3 })
            await server.post('/api/order').send(newOrder4);
            await server.post(`/api/order/rating/${newOrder4.id}`).set('Authorization', `Bearer ${token}`).send({ rating: 5 });

            const response = await server
                .get(`/api/freemasters?cityId=${newOrder3.cityId}&date=${newOrder3.date}&time=${newOrder3.time}&watchSize=${newOrder3.watchSize}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id', 2);
            expect(response.body[1]).toHaveProperty('id', 1);
        });
    });

    describe("PUT /api/master/:id", () => {
        it("should change master and return him", async () => {
            const response = await server
                .put(`/api/master/${newMaster.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ ...newMaster, name: 'Евгений' })
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('name', 'Евгений');
        });
        it("should return error that name too short", async () => {
            const response = await server
                .put(`/api/master/${newMaster.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ ...newMaster, name: 'Ев' })
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('message', 'String must contain at least 3 character(s)');
        });
        it("should return error that user with this email already exist", async () => {
            await server
                .put(`/api/master/${newMaster.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ ...newMaster, email: newMaster2.email })
                .expect("Content-Type", /json/)
                .expect(409)
                .expect('"User with this email exist"');
        });
    });

    describe("GET /api/master/:id/orders", () => {
        beforeAll(async () => {
            await server.post("/api/order").set('Authorization', `Bearer ${token}`).send(newOrder3);
        })
        it("should return master orders", async () => {
            const response = await server
                .get(`/api/master/${newMaster.id}/orders`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.count).toBe(2);
            expect(response.body.rows[0]).toHaveProperty('id', 3);
            expect(response.body.rows[1]).toHaveProperty('id', 1);
        });
        it("should return error that master does not exist", async () => {
            await server
                .get(`/api/master/10`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(404)
                .expect('"No such master"');
        });
        it("should return limited master orders", async () => {
            const response = await server
                .get(`/api/master/${newMaster.id}/orders?limit=1&page=1`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.count).toBe(2);
            expect(response.body.rows).toHaveLength(1);
        });
    });

    describe("GET /api/master-reviews/:id", () => {
        it("should return master reviews", async () => {
            const order = await server.get(`/api/order/${newOrder.id}`).set('Authorization', `Bearer ${token}`);
            await server
                .post(`/api/add-order-review/${order.body.reviewToken}`)
                .send(newReview);

            const response = await server
                .get(`/api/master-reviews/${newMaster.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('id', newOrder.id);
            expect(response.body[0]).toHaveProperty('review', newReview.review);
            expect(response.body[0]).toHaveProperty('rating', newReview.rating);
        });
        it("should return 0 master reviews", async () => {
            await server
                .get(`/api/master-reviews/${newMaster2.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .expect([]);
        });
        it("should return error that master does not exist", async () => {
            await server
                .get(`/api/master-reviews/10`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(404)
                .expect('"No such master"');
        });
        it("should return error that id must be a number", async () => {
            const response = await server
                .get(`/api/master-reviews/master`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('message', 'Expected number, received nan');
        });
    });

    describe("GET /api/statistics/master", () => {
        it("should return master statistics", async () => {
            const response = await server
                .get(`/api/statistics/master`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.rows).toHaveLength(2);
            expect(response.body.rows[0]).toHaveProperty('id', newMaster2.id);
            expect(response.body.rows[0]).toHaveProperty('name', newMaster2.name);
            expect(response.body.rows[1]).toHaveProperty('id', newMaster.id);
            expect(response.body.rows[1]).toHaveProperty('completed', '1');
        });
    });

    describe("DELETE /api/master/:id", () => {
        beforeAll(async () => {
            await server.post(`/api/city`).set('Authorization', `Bearer ${token}`).send(newCity3);
            await server.post(`/api/master/user`).set('Authorization', `Bearer ${token}`).send(newMaster20);
            await server.post(`/api/client/user`).set('Authorization', `Bearer ${token}`).send(newClient2);
            await server.post(`/api/order`).set('Authorization', `Bearer ${token}`).send(newOrder5);
        })
        it("should return error that id in wrong format", async () => {
            const response = await server
                .delete(`/api/master/stepan`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body[0]).toHaveProperty("path", ["id"]);
            expect(response.body[0]).toHaveProperty("message", "Expected number, received nan");
        });
        it("should delete master and return him", async () => {
            await server.post(`/api/master/user`).set('Authorization', `Bearer ${token}`).send(newMaster21);
            const response = await server
                .delete(`/api/master/${newMaster21.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toHaveProperty('id', newMaster21.id);
        });
        it("should return error that master has orders", async () => {
            await server
                .delete(`/api/master/${newMaster20.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(409)
                .expect('"The master has orders"');
        });
    });
});
