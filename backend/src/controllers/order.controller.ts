import { Order, Client, getOrderResponse, changeStatusOrderReq } from './../types';
import db from './../db';
import { Request, Response } from 'express';
import { validate } from '../validate';
import { sendConfMail } from '../mailer';

export default class OrderController {
    async addOrder(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['client_id', 'master_id', 'city_id', 'watch_size', 'date', 'time', 'status_id', 'rating']);

        if (error) return res.status(400).json(error);

        const { client_id, master_id, city_id, watch_size, date, time, status_id, rating }: Order = req.body;

        const overlapsOrders: number[] = (await db.query('SELECT 1 FROM orders WHERE city_id=$1 AND date=$2 AND master_id=$5 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1', [city_id, date, time, watch_size, master_id])).rows;
        if(overlapsOrders.length !== 0) return res.status(400).json("The order overlaps with others. Select another master, date or time");

        const newOrder: Order[] = (await db.query(`INSERT INTO orders (client_id, master_id, city_id, watch_size, date, time, status_id, rating) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING * `, [client_id, master_id, city_id, watch_size, date, time, status_id, rating])).rows;
        return res.status(201).json(newOrder[0]);
    }
    async getOrders(req: Request, res: Response): Promise<Response> {
        const com: string = 'select o.id, cl.name "client", m.name "master", c.name "city", o.watch_size, o.date, o.time, o.rating, s.name "status" from orders o join client cl on o.client_id = cl.id join master m on o.master_id = m.id join city c on o.city_id = c.id join status s on o.status_id = s.id order by id';
        const orders: getOrderResponse[] = (await db.query(com)).rows;
        return res.status(200).json(orders);
    }
    async getOrderById(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);

        if (error) return res.status(400).json(error);

        const id: number = Number(req.params.id);
        const order: getOrderResponse[] = (await db.query('select o.id, cl.name "client", m.name "master", c.name "city", o.watch_size, o.date, o.time, o.rating, s.name "status" from orders o where o.id = $1 join client cl on o.client_id = cl.id join master m on o.master_id = m.id join city c on o.city_id = c.id join status s on o.status_id = s.id', [id])).rows;
        return res.status(200).json(order[0]);
    }
    async updateOrder(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'client_id', 'master_id', 'city_id', 'watch_size', 'date', 'time', 'status_id', 'rating']);

        if (error) return res.status(400).json(error);

        const { id, client_id, master_id, city_id, watch_size, date, time, status_id, rating }: Order = req.body;

        const overlapsOrders: number[] = (await db.query('SELECT 1 FROM orders WHERE city_id=$1 AND date=$2 AND master_id=$5 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1 AND NOT(id=$6)', [city_id, date, time, watch_size, master_id, id])).rows;
        if(overlapsOrders.length !== 0) return res.status(400).json("The order overlaps with others. Select another master, date or time");
        
        const order: Order[] = (await db.query('UPDATE orders set client_id = $1, master_id = $2, city_id = $3, watch_size = $4, date = $5, time = $6, status_id = $8, rating = $9 where id = $7 RETURNING *', [client_id, master_id, city_id, watch_size, date, time, id, status_id, rating])).rows;
        return res.status(200).json(order[0]);
    }
    async changeStatus(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'status_id', 'rating']);

        if (error) return res.status(400).json(error);

        const { id, status_id, rating }: changeStatusOrderReq = req.body;
        const order: Order[] = (await db.query('UPDATE orders set status_id = $2, rating = $3 where id = $1 RETURNING *', [id, status_id, rating])).rows;
        return res.status(200).json(order[0]);
    }
    async deleteOrder(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);

        if (error) return res.status(400).json(error);

        const id: number = Number(req.params.id);
        const order: Order[] = (await db.query('DELETE FROM orders WHERE id=$1 RETURNING *', [id])).rows;
        return res.status(200).json(order[0]);
    }
    async addOrderClient(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['name', 'email', 'master_id', 'city_id', 'watch_size', 'date', 'time']);

        if (error) return res.status(400).json(error);

        const { name, email, master_id, city_id, watch_size, date, time }: Order & Client = req.body;

        const overlapsOrders: number[] = (await db.query('SELECT 1 FROM orders WHERE city_id=$1 AND date=$2 AND master_id=$5 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1', [city_id, date, time, watch_size, master_id])).rows;
        if(overlapsOrders.length !== 0) return res.status(400).json("The order overlaps with others. Select another master, date or time");

        const newOrder: Order[] = (await db.query(`SELECT * FROM addOrderAndClient($1, $2, $3, $4, $5, $6, $7);`, [name, email, master_id, city_id, watch_size, date, time])).rows;

        sendConfMail(email, newOrder[0].id, name);

        return res.status(201).json(newOrder[0]);
    }
}
