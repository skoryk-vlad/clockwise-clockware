import { z } from 'zod';

export const GetUserSchema = z.object({
    email: z.string().email().max(255),
});
