import { z } from 'zod';

export const AddCitySchema = z.object({
    name: z.string().trim().min(3).max(255)
});
export const GetCitySchema = z.object({
    id: z.number().int().positive()
});
export const UpdateCitySchema = z.object({
    name: z.string().trim().min(3).max(255)
});
export const DeleteCitySchema = z.object({
    id: z.number().int().positive()
});