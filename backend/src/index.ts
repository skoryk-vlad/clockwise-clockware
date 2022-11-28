import express, { Express } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV.trim()}` });

import authRouter from './routes/auth.routes';
import cityRouter from './routes/city.routes';
import clientRouter from './routes/client.routes';
import masterRouter from './routes/master.routes';
import orderRouter from './routes/order.routes';
import confirmationRouter from './routes/confirmation.routes';
import userRouter from './routes/user.routes';
import paymentRouter from './routes/payment.routes';
import mapRouter from './routes/map.routes';
import { sendReminderMailTask } from './cronTasks/sendReminderMailTask';

const PORT: number = Number(process.env.PORT) || 3001;
const app: Express = express();

app.use(cors());
app.use(express.json());

sendReminderMailTask();
app.use('/api', authRouter);
app.use('/api', cityRouter);
app.use('/api', clientRouter);
app.use('/api', masterRouter);
app.use('/api', orderRouter);
app.use('/api', confirmationRouter);
app.use('/api', userRouter);
app.use('/api', paymentRouter);
app.use('/api', mapRouter);

app.get('/api/ping', (req, res) => {
    res.sendStatus(200);
});

if (process.env.NODE_ENV.trim() !== 'test') {
    app.listen(PORT, () => { console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV}mode`); });
}

export default app;
