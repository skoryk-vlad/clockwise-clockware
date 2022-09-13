import express, { Express } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV[0] === 'l' ? 'local' : 'prod'}` })

import authRouter from './routes/auth.routes';
import cityRouter from './routes/city.routes';
import clientRouter from './routes/client.routes';
import masterRouter from './routes/master.routes';
import orderRouter from './routes/order.routes';
import confirmationRouter from './routes/confirmation.routes';

const PORT: number = Number(process.env.PORT) || 3001;
const app: Express = express();


app.use(cors());
app.use(express.json());

app.use('/api', authRouter);
app.use('/api', cityRouter);
app.use('/api', clientRouter);
app.use('/api', masterRouter);
app.use('/api', orderRouter);
app.use('/api', confirmationRouter);

app.listen(PORT, () => { console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV}mode`); });
