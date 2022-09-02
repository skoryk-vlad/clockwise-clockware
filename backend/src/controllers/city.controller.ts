import { City, CityAttributes } from './../models/city.model';
import { Request, Response } from 'express';
import { validate } from '../validate';

export default class CityController {
    async addCity(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['name']);
        if (error) return res.status(400).json(error);

        const { name }: CityAttributes = req.body;
        try {
            const city = await City.upsert({ name }, {
                conflictFields: ['name']
            });
            return res.status(201).json(city);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async getCities(req: Request, res: Response): Promise<Response> {
        try {
            const cities = await City.findAll({
                order: [
                    ['id', 'ASC']
                ]
            });
            return res.status(200).json(cities);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async getCityById(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);
        if (error) return res.status(400).json(error);

        const id = +req.params.id;
        try {
            const city = await City.findByPk(id);
            return res.status(200).json(city);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async updateCity(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'name']);
        if (error) return res.status(400).json(error);

        const { id, name }: CityAttributes = req.body;
        try {
            const [city, created] = await City.upsert({
                id,
                name
            });
            return res.status(200).json(city);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async deleteCity(req: Request, res: Response): Promise<Response> {
        let error: string = await validate(req.params, ['id']);
        if (error) return res.status(400).json(error);

        const id = +req.params.id;
        try {
            const city = await City.findByPk(id);
            await city.destroy();
            return res.status(200).json(city);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}
