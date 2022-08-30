import { Master } from './../types';
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import db from './../db';
import { validate } from './../validate';

export default class MasterController {
    async addMaster(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['name', 'cities']);

        if (error) return res.status(400).json(error);

        const {name, cities}: Master = req.body;
        const newMaster: Master[] = (await db.query(`INSERT INTO master (name, cities) values ($1, $2) RETURNING * `, [name, `{${cities.join(',')}}`])).rows;
        return res.status(201).json(newMaster[0]);
    }
    async getMasters(req: Request, res: Response): Promise<Response> {
        const masters: QueryResult = await db.query('select m.id, m.name, m.cities, round(avg(o.rating) filter(where o.rating > 0), 1) "rating" from master m, orders o where m.id = o.master_id group by m.id; SELECT *, null "rating" FROM master WHERE id NOT IN (SELECT master_id FROM orders WHERE master_id IS NOT NULL)');
        return res.status(200).json([...masters[0].rows, ...masters[1].rows].sort((a,b) => a.id - b.id));
    }
    async getMasterById(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);

        if (error) return res.status(400).json(error);

        const id: number = Number(req.params.id);
        const master: Master[] = (await db.query('SELECT * FROM master WHERE id=$1', [id])).rows;
        return res.status(200).json(master[0]);
    }
    async getAvailableMasters(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.query, ['city_id', 'date', 'time', 'watch_size']);

        if (error) return res.status(400).json(error);

        const {city_id, date, time, watch_size} = req.query;
        
        const masters: Master[] = (await db.query(`SELECT m.id, m.name, ROUND(AVG(o.rating) FILTER(WHERE o.rating > 0 AND o.master_id = m.id), 1) "rating"
                                                                        FROM master m, orders o WHERE m.id IN (SELECT id FROM master WHERE $1 = ANY (cities) AND
                                                                        id NOT IN (SELECT DISTINCT master_id FROM orders WHERE city_id=$1 AND date=$2 AND
                                                                        time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1)) AND
                                                                        (m.id = o.master_id OR NOT EXISTS (SELECT * FROM orders WHERE master_id=m.id))
                                                                        GROUP BY m.id ORDER BY rating DESC NULLS LAST, id;`,
                                                                        [city_id, date, time, watch_size])).rows; 
        
        return res.status(200).json(masters);
    }
    async updateMaster(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'name', 'cities']);

        if (error) return res.status(400).json(error);

        const {id, name, cities}: Master = req.body;
        const master: Master[] = (await db.query('UPDATE master set name = $1, cities = $2 where id = $3 RETURNING *', [name, `{${cities.join(',')}}`, id])).rows;
        return res.status(200).json(master[0]);
    }
    async deleteMaster(req: Request, res: Response): Promise<Response> {
        let error: string = await validate(req.params, ['id']);

        if (error) return res.status(400).json(error);

        const id: number = Number(req.params.id);

        const masterOrders: number[] = (await db.query('SELECT 1 FROM orders WHERE master_id=$1', [id])).rows;
        if(masterOrders.length !== 0) return res.status(400).json("There are rows in the table 'orders' that depend on this master");

        const master: Master[] = (await db.query('DELETE FROM master WHERE id=$1 RETURNING *', [id])).rows;
        return res.status(200).json(master[0]);
    }
}
