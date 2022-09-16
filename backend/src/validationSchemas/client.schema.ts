import { CLIENT_STATUSES } from './../models/client.model';
import { z } from 'zod';

export const AddClientSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    password: z.string().min(8).max(30).optional(),
    status: z.nativeEnum(CLIENT_STATUSES)
});
export const GetClientSchema = z.object({
    id: z.number().int().positive()
});
export const UpdateClientSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    status: z.nativeEnum(CLIENT_STATUSES)
});
export const DeleteClientSchema = z.object({
    id: z.number().int().positive()
});
export const checkClientByEmailSchema = z.object({
    email: z.string().email().max(255),
});