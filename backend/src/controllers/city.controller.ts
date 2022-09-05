import { CitySchema } from './../validationSchemas/city.schema';
import { City } from './../models/city.model';
import { Request, Response } from 'express';

export default class CityController {
    async addCity(req: Request, res: Response): Promise<Response> {
        const optionalId = CitySchema.partial({
            id: true,
        });
        try {
            const { name } = optionalId.parse(req.body);
            const city = await City.create({ name });
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
        try {
            const id = CitySchema.shape.id.parse(+req.params.id);
            const city = await City.findByPk(id);
            if (!city) return res.status(404).json('No such city');
            return res.status(200).json(city);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async updateCity(req: Request, res: Response): Promise<Response> {
        try {
            const { id, name } = CitySchema.parse(req.body);

            const existCity = await City.findByPk(id);
            if (!existCity) return res.status(404).json('No such city');

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
        try {
            const id = CitySchema.shape.id.parse(+req.params.id);
            const city = await City.findByPk(id);
            if (!city) return res.status(404).json('No such city');
            await city.destroy();
            return res.status(200).json(city);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}
