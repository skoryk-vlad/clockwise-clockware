import { Master } from './../models/master.model';
import { CityMaster } from './../models/cityMaster.model';
import { AddCitySchema, DeleteCitySchema, GetCitySchema, UpdateCitySchema } from './../validationSchemas/city.schema';
import { City } from './../models/city.model';
import { Request, Response } from 'express';

export default class CityController {
    async addCity(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = AddCitySchema.parse(req.body);
            const city = await City.create({ name });
            return res.status(201).json(city);
        } catch (error) {
            if(error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getCities(req: Request, res: Response): Promise<Response> {
        try {
            const cities = await City.findAll({
                order: [
                    ['id', 'ASC']
                ],
                include: [{
                    model: CityMaster,
                    as: 'CityMaster',
                    include: [{
                        model: Master,
                        as: 'Master',
                    }]
                }]
            });
            return res.status(200).json(cities);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async getCityById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetCitySchema.parse({id: +req.params.id});
            const city = await City.findByPk(id);
            if (!city) return res.status(404).json('No such city');
            return res.status(200).json(city);
        } catch (error) {
            if(error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }

    async updateCity(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetCitySchema.parse({id: +req.params.id});

            const existCity = await City.findByPk(id);
            if (!existCity) return res.status(404).json('No such city');

            const { name } = UpdateCitySchema.parse(req.body);

            const [city, created] = await City.upsert({
                id,
                name
            });
            return res.status(200).json(city);
        } catch (error) {
            if(error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }

    async deleteCity(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = DeleteCitySchema.parse({id: +req.params.id});
            const city = await City.findByPk(id);
            if (!city) return res.status(404).json('No such city');
            await city.destroy();
            return res.status(200).json(city);
        } catch (error) {
            if(error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
}
