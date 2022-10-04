import { WatchSizesTranslate } from './../models/order.model';
import { z } from 'zod';

export const CreatePaymentSchema = z.object({
    watchSize: z.nativeEnum(WatchSizesTranslate),
    price: z.number().int().positive(),
    orderId: z.number().int().positive(),
});
