import { WATCH_SIZES, ORDER_STATUSES, Order } from './../models/order.model';
import { boolean, z } from 'zod';

export const AddOrderSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    watchSize: z.nativeEnum(WATCH_SIZES),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/),
    time: z.number().int().min(10).max(18),
    masterId: z.number().int().positive(),
    cityId: z.number().int().positive(),
    status: z.nativeEnum(ORDER_STATUSES).optional()
});
export const GetOrdersSchema = z.object({
    limit: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    page: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    masters: z.array(z.number().int().positive()).optional(),
    clients: z.array(z.number().int().positive()).optional(),
    cities: z.array(z.number().int().positive()).optional(),
    statuses: z.array(z.nativeEnum(ORDER_STATUSES)).optional(),
    dateStart: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional(),
    dateEnd: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional(),
    sortedField: z.string().refine(field => [...Object.keys(Order.getAttributes()), 'city', 'client', 'master'].includes(field)).optional(),
    isDirectedASC: z.boolean().optional(),
    priceRange: z.array(z.number().int().nonnegative()).length(2).optional()
});
export const GetOrderSchema = z.object({
    id: z.number().int().positive()
});
export const UpdateOrderSchema = z.object({
    watchSize: z.nativeEnum(WATCH_SIZES),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/),
    time: z.number().int().min(10).max(18),
    rating: z.number().int().min(0).max(5),
    clientId: z.number().int().positive(),
    masterId: z.number().int().positive(),
    cityId: z.number().int().positive(),
    status: z.nativeEnum(ORDER_STATUSES)
});
export const DeleteOrderSchema = z.object({
    id: z.number().int().positive()
});
export const ChangeStatusSchema = z.object({
    status: z.nativeEnum(ORDER_STATUSES)
});
export const SetRatingSchema = z.object({
    rating: z.number().int().min(0).max(5)
});
export const addReviewSchema = z.object({
    rating: z.number().int().min(0).max(5),
    review: z.string().max(1000).optional()
});
