import { z } from 'zod';

export const AddOrderSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    watchSize: z.number().int().min(1).max(3),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/),
    time: z.number().int().min(10).max(18),
    masterId: z.number().int().positive(),
    cityId: z.number().int().positive()
});
export const GetOrderSchema = z.object({
    id: z.number().int().positive()
});
export const UpdateOrderSchema = z.object({
    watchSize: z.number().int().min(1).max(3),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/),
    time: z.number().int().min(10).max(18),
    rating: z.number().int().min(0).max(5),
    clientId: z.number().int().positive(),
    masterId: z.number().int().positive(),
    cityId: z.number().int().positive(),
    statusId: z.number().int().min(1).max(4)
});
export const DeleteOrderSchema = z.object({
    id: z.number().int().positive()
});
export const ChangeStatusSchema = z.object({
    id: z.number().int().positive(),
    rating: z.number().int().min(0).max(5),
    statusId: z.number().int().min(1).max(4)
});