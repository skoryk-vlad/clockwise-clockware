import { formatISO } from 'date-fns';
import { WATCH_SIZES, ORDER_STATUSES, Order } from './../models/order.model';
import { z } from 'zod';
import { isAfter } from 'date-fns';

export const AddOrderSchema = z.object({
    id: z.number().int().positive().optional(),
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    watchSize: z.nativeEnum(WATCH_SIZES),
    date: z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date()).transform(date => formatISO(date, { representation: 'date' })),
    time: z.preprocess(
        (a) => typeof a === 'string' ? parseInt(z.string().parse(a), 10) : a,
        z.number().int().min(10).max(18)
    ),
    masterId: z.preprocess(
        (a) => typeof a === 'string' ? parseInt(z.string().parse(a), 10) : a,
        z.number().int().positive()
    ),
    cityId: z.preprocess(
        (a) => typeof a === 'string' ? parseInt(z.string().parse(a), 10) : a,
        z.number().int().positive()
    ),
    status: z.nativeEnum(ORDER_STATUSES),
    address: z.string().trim().max(255),
    lngLat: z.preprocess(value => String(value).split(',').map(coord => +coord), z.array(z.number().min(-180).max(180))).optional(),
})
.superRefine((order, ctx) => {
    if (!(order.time + Object.values(WATCH_SIZES).indexOf(order.watchSize) + 1 < 20)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['time'],
            message: "Wrong time or watch size selected",
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['watchSize'],
            message: "Wrong time or watch size selected",
        });
    }
});;
export const GetOrdersSchema = z.object({
    limit: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    page: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    cities: z.preprocess(value => String(value).split(',').map(id => +id), z.array(z.number().int().positive())).optional(),
    masters: z.preprocess(value => String(value).split(',').map(id => +id), z.array(z.number().int().positive())).optional(),
    clients: z.preprocess(value => String(value).split(',').map(id => +id), z.array(z.number().int().positive())).optional(),
    statuses: z.preprocess(value => String(value).split(','), z.array(z.nativeEnum(ORDER_STATUSES))).optional(),
    dateStart: z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date()).transform(date => formatISO(date, { representation: 'date' })).optional(),
    dateEnd: z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date()).transform(date => formatISO(date, { representation: 'date' })).optional(),
    sortedField: z.string().refine(field => [...Object.keys(Order.getAttributes()), 'city', 'client', 'master'].includes(field)).optional(),
    isDirectedASC: z.enum(['true', 'false']).transform(isDirectedASC => isDirectedASC === 'true').optional(),
    priceRange: z.preprocess(value => String(value).split(',').map(id => +id), z.array(z.number().int().nonnegative()).length(2)).optional(),
});
export const GetOrderSchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    )
});
export const UpdateOrderSchema = z.object({
    watchSize: z.nativeEnum(WATCH_SIZES),
    date: z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date()).transform(date => formatISO(date, { representation: 'date' })),
    time: z.number().int().min(10).max(18),
    rating: z.number().int().min(0).max(5),
    clientId: z.number().int().positive(),
    masterId: z.number().int().positive(),
    cityId: z.number().int().positive(),
    status: z.nativeEnum(ORDER_STATUSES)
});
export const DeleteOrderSchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    )
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
export const addImagesSchema = z.array(z.any().refine(file => file.mimetype.includes('image/') && file.size <= 1048576, 'The file must be an image and less than 1 MB in size')).optional();
export const GetCityOrMasterbyDateSchema = z.object({
    dateStart: z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date()).transform(date => formatISO(date, { representation: 'date' })).optional(),
    dateEnd: z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date()).transform(date => formatISO(date, { representation: 'date' })).optional(),
}).refine(value => !value.dateStart || !value.dateEnd || !isAfter(new Date(value.dateStart), new Date(value.dateEnd)), {
    path: ['dateStart'], message: 'End date must be after start date'
});
export const GetOrderDatesStatisticsSchema = z.object({
    dateStart: z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date()).transform(date => formatISO(date, { representation: 'date' })).optional(),
    dateEnd: z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date()).transform(date => formatISO(date, { representation: 'date' })).optional(),
    masters: z.preprocess(value => String(value).split(',').map(id => +id), z.array(z.number().int().positive())).optional(),
    cities: z.preprocess(value => String(value).split(',').map(id => +id), z.array(z.number().int().positive())).optional(),
}).refine(value => !value.dateStart || !value.dateEnd || !isAfter(new Date(value.dateStart), new Date(value.dateEnd)), {
    path: ['dateStart'], message: 'End date must be after start date'
});