import { City, Master, Order } from './../types';
import { Request, Response } from 'express';
import db from '../db';
import { validate } from '../validate';

export default class CityController {
    async addCity(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['name']);

        if (error) return res.status(400).json(error);

        const { name }: City = req.body;
        const city: City[] = (await db.query(`SELECT * FROM addCity($1)`, [name])).rows;
        return res.status(201).json(city[0]);
    }
    async getCities(req: Request, res: Response): Promise<Response> {
        const cities: City[] = (await db.query('SELECT * FROM city ORDER BY id')).rows;
        return res.status(200).json(cities);
    }
    async getCityById(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);

        if (error) return res.status(400).json(error);

        const id: number = Number(req.params.id);
        const city: City[] = (await db.query('SELECT * FROM city WHERE id=$1', [id])).rows;
        return res.status(200).json(city[0]);
    }
    async updateCity(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'name']);

        if (error) return res.status(400).json(error);

        const { id, name }: City = req.body;
        const city: City[] = (await db.query(`SELECT * FROM updateCity($1, $2);`, [id, name])).rows;
        return res.status(200).json(city[0]);
    }
    async deleteCity(req: Request, res: Response): Promise<Response> {
        let error: string = await validate(req.params, ['id']);

        if (error) return res.status(400).json(error);

        const id: number = Number(req.params.id);
        
        const cityMasters: Master[] = (await db.query('SELECT * FROM master WHERE $1 = ANY (cities)', [id])).rows;
        if (cityMasters.length !== 0) return res.status(400).json("There are rows in the table 'master' that depend on this city");
        
        const cityOrders: Order[] = (await db.query('SELECT * FROM orders WHERE city_id=$1', [id])).rows;
        if (cityOrders.length !== 0) return res.status(400).json("There are rows in the table 'orders' that depend on this city");

        const city: City[] = (await db.query('DELETE FROM city WHERE id=$1 RETURNING *', [id])).rows;
        return res.status(200).json(city[0]);
    }
}
