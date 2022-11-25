import { MapArea } from './../models/mapArea.model';
import { Op } from 'sequelize';
import { Master } from './../models/master.model';
import { AddCitySchema, DeleteCitySchema, GetCitySchema, UpdateCitySchema, GetCitiesSchema } from './../validationSchemas/city.schema';
import { City } from './../models/city.model';
import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { sequelize } from '../sequelize';

export default class CityController {
    async addCity(req: Request, res: Response): Promise<Response> {
        try {
            const { id, name, price } = AddCitySchema.parse(req.body);
            const city = await City.create({ id, name, price });
            return res.status(201).json(city);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getCities(req: Request, res: Response): Promise<Response> {
        try {
            const { limit, page, sortedField, isDirectedASC, name } = GetCitiesSchema.parse(req.query);

            const { count, rows } = await City.findAndCountAll({
                include: [Master, {
                    model: MapArea,
                    as: 'MapArea',
                    attributes: ['cityId']
                }],
                where: {
                    name: { [Op.iLike]: `%${name || ''}%` }
                },
                order: [[
                    sortedField || 'id',
                    isDirectedASC ? 'ASC' : 'DESC']],
                limit: limit || 25,
                offset: limit * (page - 1) || 0,
                distinct: true
            });
            return res.status(200).json({ count, rows });
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getCityById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetCitySchema.parse(req.params);
            const city = await City.findByPk(id);
            if (!city) return res.status(404).json('No such city');
            return res.status(200).json(city);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }

    async updateCity(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetCitySchema.parse(req.params);

            const city = await City.findByPk(id);
            if (!city) return res.status(404).json('No such city');

            const { name, price } = UpdateCitySchema.parse(req.body);

            city.update({ name, price });
            return res.status(200).json(city);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }

    async deleteCity(req: Request, res: Response): Promise<Response> {
        const deleteCityTransaction = await sequelize.transaction();
        try {
            const { id } = DeleteCitySchema.parse(req.params);

            const city = await City.findByPk(id);
            if (!city) return res.status(404).json('No such city');

            const order = await Order.findOne({ where: { cityId: id } });
            if (order) return res.status(409).json('There are orders in this city');

            const mapArea = await MapArea.findOne({ where: { cityId: id } });
            if (mapArea) await mapArea.destroy({ transaction: deleteCityTransaction });

            await city.destroy({ transaction: deleteCityTransaction });

            deleteCityTransaction.commit();
            return res.status(200).json(city);
        } catch (error) {
            deleteCityTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
}
