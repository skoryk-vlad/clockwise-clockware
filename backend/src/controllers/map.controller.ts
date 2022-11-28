import { City } from './../models/city.model';
import { setAreaSchema, getAreaSchema, checkPointInAreaSchema } from './../validationSchemas/mapArea.schema';
import { Request, Response } from 'express';
import { MapArea } from '../models/mapArea.model';
import { sequelize } from '../sequelize';

export default class MapController {
    async setAreas(req: Request, res: Response): Promise<Response> {
        const setAreasTransaction = await sequelize.transaction();
        try {
            const { areas, cityId } = setAreaSchema.parse(req.body);

            const existCity = await City.findByPk(cityId);
            if (!existCity) return res.status(404).json('No such city');

            await MapArea.destroy({ where: { cityId }, transaction: setAreasTransaction });

            const mapAreas = await Promise.all(areas.map(async area => await MapArea.create({ area, cityId }, { transaction: setAreasTransaction })));

            setAreasTransaction.commit();
            return res.status(201).json(mapAreas);
        } catch (error) {
            setAreasTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getAreas(req: Request, res: Response): Promise<Response> {
        try {
            const { cityId } = getAreaSchema.parse(req.params);

            const existCity = await City.findByPk(cityId);
            if (!existCity) return res.status(404).json('No such city');

            const mapAreas = await MapArea.findAll({ where: { cityId } });
            if (mapAreas.length === 0) return res.status(404).json('No area for this city');

            return res.status(200).json(mapAreas);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async checkPointInArea(req: Request, res: Response): Promise<Response> {
        try {
            const { lng, lat, cityId } = checkPointInAreaSchema.parse(req.query);

            const existCity = await City.findByPk(cityId);
            if (!existCity) return res.status(404).json('No such city');

            const mapAreas = await MapArea.findAll({ where: { cityId } });

            if (mapAreas.length === 0) return res.status(404).json('No areas for this city');

            const isPointAvailable = mapAreas.some(mapArea => {
                const area = mapArea.getDataValue('area')[0];

                return area.reduce((acc, coord, index) => {
                    const tempCoord = area.at(index - 1);
                    if ((((coord[1] <= lat) && (lat < tempCoord[1])) || ((tempCoord[1] <= lat) && (lat < coord[1]))) &&
                        (lng > (tempCoord[0] - coord[0]) * (lat - coord[1]) / (tempCoord[1] - coord[1]) + coord[0]))
                        return !acc;
                    return acc;
                }, false)
            });

            return res.status(200).json(isPointAvailable);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
}
