import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';

function parseJwt (token: string) : any {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export default class ConfirmationController {
    async confirmOrder(req: Request, res: Response): Promise<void> {
        const token: string = req.params.conftoken;

        if (token) {
            jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err) => {
                if (err) return res.redirect(`${process.env.CLIENT_LINK}?expired`);
                
                const order_id: number = parseJwt(token).order_id;

                const orderConfimed: number[] = (await db.query('SELECT 1 FROM orders WHERE id=$1 AND status_id=2', [order_id])).rows;
                if(orderConfimed.length !== 0) res.redirect(`${process.env.CLIENT_LINK}?confirmed`);

                await db.query('UPDATE orders set status_id = 2 where id = $1 RETURNING *', [order_id]);

                res.redirect(`${process.env.CLIENT_LINK}?success`);
            });
        } else {
            res.redirect(`${process.env.CLIENT_LINK}?error`);
        }
    }
}
