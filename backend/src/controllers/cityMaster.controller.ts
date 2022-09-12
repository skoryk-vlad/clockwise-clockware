import { Master } from './../models/master.model';
import { City } from './../models/city.model';
import { CityMaster } from './../models/cityMaster.model';
import { AddCityMasterSchema, DeleteCityMasterSchema, GetCityMasterSchema, UpdateCityMasterSchema } from './../validationSchemas/cityMaster.schema';
import { Request, Response } from 'express';

export default class CityController {
    async addCityMaster(req: Request, res: Response): Promise<Response> {
        try {
            const { cityId, masterId } = AddCityMasterSchema.parse(req.body);

            const existCity = await City.findByPk(cityId);
            if (!existCity) return res.status(404).json('No such city');
            const existMaster = await Master.findByPk(masterId);
            if (!existMaster) return res.status(404).json('No such master');

            const cityMaster = await CityMaster.create({ cityId, masterId });
            return res.status(201).json(cityMaster);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getCityMasters(req: Request, res: Response): Promise<Response> {
        try {
            const cityMasters = await CityMaster.findAll({
                include:
                    [
                        {
                            model: City,
                            as: 'City'
                        },
                        {
                            model: Master,
                            as: 'Master'
                        },
                    ],
                order: [
                    ['id', 'ASC']
                ]
            });
            return res.status(200).json(cityMasters);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async getCityMasterById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetCityMasterSchema.parse({ id: +req.params.id });
            const cityMaster = await CityMaster.findByPk(id);
            if (!cityMaster) return res.status(404).json('No such city and master relation');
            return res.status(200).json(cityMaster);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }

    async updateCityMaster(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetCityMasterSchema.parse({ id: +req.params.id });


            const existCityMaster = await CityMaster.findByPk(id);
            if (!existCityMaster) return res.status(404).json('No such city and master relation');

            const { cityId, masterId } = UpdateCityMasterSchema.parse(req.body);

            const existCity = await City.findByPk(cityId);
            if (!existCity) return res.status(404).json('No such city');
            const existMaster = await Master.findByPk(masterId);
            if (!existMaster) return res.status(404).json('No such master');

            const [cityMaster, created] = await CityMaster.upsert({
                id,
                cityId,
                masterId
            });
            return res.status(200).json(cityMaster);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }

    async deleteCityMaster(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = DeleteCityMasterSchema.parse({ id: +req.params.id });
            const cityMaster = await CityMaster.findByPk(id);
            if (!cityMaster) return res.status(404).json('No such city and master relation');
            await cityMaster.destroy();
            return res.status(200).json(cityMaster);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
}
