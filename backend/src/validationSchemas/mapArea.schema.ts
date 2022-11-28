import { z } from 'zod';

export const setAreaSchema = z.object({
    areas: z.array(z.array(z.array(z.array(z.number().min(-180).max(180))))),
    cityId: z.number().int().positive()
});
export const getAreaSchema = z.object({
    cityId: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    )
});
export const checkPointInAreaSchema = z.object({
    cityId: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().int().positive()
    ),
    lng: z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z.number().min(-180).max(180)
    ),
    lat: z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z.number().min(-90).max(90)
    )
});
