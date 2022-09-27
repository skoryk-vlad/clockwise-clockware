import { Master, MASTER_STATUSES } from './../models/master.model';
import { Client, CLIENT_STATUSES } from './../models/client.model';
import { ROLES, User } from './../models/user.model';
import { Request, Response } from 'express';
import { validate as uuidValidate } from 'uuid';

export default class ConfirmationController {
    async confirmUser(req: Request, res: Response): Promise<void> {
        const confirmationToken: string = req.params.confirmationToken;

        if (uuidValidate(confirmationToken)) {
            try {
                const user = await User.findOne({ where: { confirmationToken } });
                if (!user) return res.redirect(`${process.env.CLIENT_LINK}/message/error`);

                if (user.getDataValue('role') === ROLES.CLIENT) {
                    const client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                    if (client) {
                        if (client.getDataValue('status') !== CLIENT_STATUSES.NOT_CONFIRMED) return res.redirect(`${process.env.CLIENT_LINK}/message/already-confirmed`);
                        await client.update({ status: CLIENT_STATUSES.CONFIRMED });
                    }
                } else if (user.getDataValue('role') === ROLES.MASTER) {
                    const master = await Master.findOne({ where: { userId: user.getDataValue('id') } });
                    if (master) {
                        if (master.getDataValue('status') !== MASTER_STATUSES.NOT_CONFIRMED || master.getDataValue('status') === MASTER_STATUSES.APPROVED) return res.redirect(`${process.env.CLIENT_LINK}/message/already-confirmed`);
                        await master.update({ status: MASTER_STATUSES.CONFIRMED });
                    }
                }

                return res.redirect(`${process.env.CLIENT_LINK}/message/success`);
            } catch (error) {
                return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
            }
        } else {
            return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
        }
    }
}
