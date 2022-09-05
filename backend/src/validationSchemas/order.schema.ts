import { z } from 'zod';

export const OrderSchema = z.object({
    id: z.number().int(),
    watchSize: z.number().int().min(1).max(3),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/),
    time: z.number().int().min(10).max(18),
    rating: z.number().int().min(0).max(5),
    clientId: z.number().int(),
    masterId: z.number().int(),
    cityId: z.number().int(),
    statusId: z.number().int().min(1).max(4)
});