import { z } from 'zod';

export const AddClientSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255)
});
export const GetClientSchema = z.object({
    id: z.number().int().positive()
});
export const UpdateClientSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255)
});
export const DeleteClientSchema = z.object({
    id: z.number().int().positive()
});