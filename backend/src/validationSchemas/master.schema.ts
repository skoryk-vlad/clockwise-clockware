import { z } from 'zod';

export const MasterSchema = z.object({
    id: z.number().int(),
    name: z.string().trim().min(3),
    cities: z.array(z.number()).nonempty()
});