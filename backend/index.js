const express = require('express');
require('dotenv').config();
const cors = require('cors');

const cityRouter = require('./routes/city.routes');
const clientRouter = require('./routes/client.routes');
const masterRouter = require('./routes/master.routes');
const orderRouter = require('./routes/order.routes');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

// app.get('/*', function (req, res) {
//     // res.sendFile(path.join(__dirname, 'path/to/your/index.html'), function (err) {
//     //     if (err) {
//     //         res.status(500).send(err)
//     //     }
//     // })
//     res.send('ffff');
// });


app.use('/api', cityRouter);
app.use('/api', clientRouter);
app.use('/api', masterRouter);
app.use('/api', orderRouter);


const authInfo = {
    login: 'admin@example.com',
    password: 'passwordsecret'
}

app.post('/auth', (req, res) => {
    const { login, password } = req.body.params;
    let isRight = false;

    if (login === authInfo.login && password === authInfo.password) {
        isRight = true;
    }
    res.send(isRight);
});


app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });
