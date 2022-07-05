const express = require('express');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV[0] === 'l' ? 'local' : 'prod'}` });
const cors = require('cors');

const cityRouter = require('./routes/city.routes');
const clientRouter = require('./routes/client.routes');
const masterRouter = require('./routes/master.routes');
const orderRouter = require('./routes/order.routes');
const authRouter = require('./routes/auth.routes');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', cityRouter);
app.use('/api', clientRouter);
app.use('/api', masterRouter);
app.use('/api', orderRouter);
app.use('/api', authRouter.router);


app.listen(PORT, () => { console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV}mode`); });
