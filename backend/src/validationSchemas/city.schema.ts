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
    ).optional()
});
export const GetCitySchema = z.object({
    id: z.number().int().positive()
});
export const UpdateCitySchema = z.object({
    name: z.string().trim().min(3).max(255),
    price: z.number().int().positive()
});
export const DeleteCitySchema = z.object({
    id: z.number().int().positive()
});
