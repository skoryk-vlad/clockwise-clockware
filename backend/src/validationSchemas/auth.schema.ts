import { z } from 'zod';
import { AUTH_SERVICES } from '../types';

export const LoginSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().min(8).max(30),
});
export const LoginByServiceSchema = z.object({
    token: z.string(),
    service: z.nativeEnum(AUTH_SERVICES),
});
