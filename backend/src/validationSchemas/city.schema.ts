import { z } from 'zod';

export const CitySchema = z.object({
    id: z.number().int(),
    name: z.string().trim().min(3)
});