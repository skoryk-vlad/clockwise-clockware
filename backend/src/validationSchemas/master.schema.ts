import { MASTER_STATUSES, Master } from './../models/master.model';
import { WATCH_SIZES, Order } from './../models/order.model';
import { z } from 'zod';

export const AddMasterSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    cities: z.array(z.number().int().positive()).nonempty(),
    status: z.nativeEnum(MASTER_STATUSES),
    password: z.string().min(8).max(30)
});
export const AddMasterByAdminSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    cities: z.array(z.number().int().positive()).nonempty(),
    status: z.nativeEnum(MASTER_STATUSES)
});
export const GetMastersSchema = z.object({
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
    statuses: z.preprocess(value => String(value).split(','), z.array(z.nativeEnum(MASTER_STATUSES))).optional(),
    sortedField: z.string().refine(field => [...Object.keys(Master.getAttributes()), 'email', 'Cities'].includes(field)).optional(),
    isDirectedASC: z.enum(['true', 'false']).transform(isDirectedASC => isDirectedASC === 'true').optional(),
    name: z.string().optional(),
});
export const GetMasterSchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    )
});
export const GetMasterOrdersSchema = z.object({
    limit: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    page: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    sortedField: z.string().refine(field => [...Object.keys(Order.getAttributes()), 'city', 'client'].includes(field)).optional(),
    isDirectedASC: z.enum(['true', 'false']).transform(isDirectedASC => isDirectedASC === 'true').optional(),
});
export const UpdateMasterSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    cities: z.array(z.number().int().positive()).nonempty(),
    status: z.nativeEnum(MASTER_STATUSES)
});
export const DeleteMasterSchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    )
});
export const GetFreeMastersSchema = z.object({
    cityId: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ),
    watchSize: z.nativeEnum(WATCH_SIZES),
    time: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().min(10).max(18)
    ),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/),
});
