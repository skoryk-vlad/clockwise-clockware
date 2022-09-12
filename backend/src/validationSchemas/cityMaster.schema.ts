import { z } from 'zod';

export const AddCityMasterSchema = z.object({
    masterId: z.number().int().positive(),
    cityId: z.number().int().positive(),
});
export const GetCityMasterSchema = z.object({
    id: z.number().int().positive()
});
export const UpdateCityMasterSchema = z.object({
    masterId: z.number().int().positive(),
    cityId: z.number().int().positive(),
});
export const DeleteCityMasterSchema = z.object({
    id: z.number().int().positive()
});