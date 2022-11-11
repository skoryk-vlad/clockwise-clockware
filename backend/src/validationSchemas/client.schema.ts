import { AUTH_SERVICES } from './../types';
import { Order } from './../models/order.model';
import { CLIENT_STATUSES, Client } from './../models/client.model';
import { z } from 'zod';

export const AddClientSchema = z.object({
    id: z.number().int().positive().optional(),
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    password: z.string().min(8).max(30),
    status: z.nativeEnum(CLIENT_STATUSES)
});
export const AddClientByServiceSchema = z.object({
    token: z.string(),
    service: z.nativeEnum(AUTH_SERVICES),
});
export const AddClientByAdminSchema = z.object({
    id: z.number().int().positive().optional(),
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    status: z.nativeEnum(CLIENT_STATUSES)
});
export const GetClientsSchema = z.object({
    limit: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    page: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    sortedField: z.string().refine(field => [...Object.keys(Client.getAttributes()), 'email'].includes(field)).optional(),
    isDirectedASC: z.enum(['true', 'false']).transform(isDirectedASC => isDirectedASC === 'true').optional(),
    name: z.string().optional()
});
export const GetClientSchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    )
});
export const GetClientOrdersSchema = z.object({
    limit: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    page: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ).optional(),
    sortedField: z.string().refine(field => [...Object.keys(Order.getAttributes()), 'master'].includes(field)).optional(),
    isDirectedASC: z.enum(['true', 'false']).transform(isDirectedASC => isDirectedASC === 'true').optional(),
});
export const UpdateClientSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().max(255),
    status: z.nativeEnum(CLIENT_STATUSES)
});
export const DeleteClientSchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    )
});
