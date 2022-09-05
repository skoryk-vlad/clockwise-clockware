import { z } from 'zod';

export const ClientSchema = z.object({
    id: z.number().int(),
    name: z.string().trim().min(3),
    email: z.string().email()
});