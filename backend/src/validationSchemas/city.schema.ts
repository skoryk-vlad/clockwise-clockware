import { City } from './../models/city.model';
import { z } from 'zod';

export const AddCitySchema = z.object({
    name: z.string().trim().min(3).max(255),
    price: z.number().int().positive()
});
export const GetCitiesSchema = z.object({
    limit: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    page: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    sortedField: z.string().refine(field => Object.keys(City.getAttributes()).includes(field)).optional(),
    isDirectedASC: z.enum(['true', 'false']).transform(isDirectedASC => isDirectedASC === 'true').optional(),
    name: z.string().optional()
});
export const GetCitySchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    )
});
export const UpdateCitySchema = z.object({
    name: z.string().trim().min(3).max(255),
    price: z.number().int().positive()
});
export const DeleteCitySchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    )
});
