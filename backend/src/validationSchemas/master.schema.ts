import { z } from 'zod';

export const AddMasterSchema = z.object({
    name: z.string().trim().min(3).max(255)
});
export const GetMasterSchema = z.object({
    id: z.number().int().positive()
});
export const UpdateMasterSchema = z.object({
    name: z.string().trim().min(3).max(255)
});
export const DeleteMasterSchema = z.object({
    id: z.number().int().positive()
});
export const GetFreeMastersSchema = z.object({
    cityId: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive()
    ),
    watchSize: z.string(),
    time: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().min(10).max(18)
    ),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/),
});