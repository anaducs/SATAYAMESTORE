const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv/config');;
const api = process.env.API_URL;
const db_connector = process.env.Db_connection;
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const orderRouter = require('./routes/orders');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/erroHandler');


//middleware
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);


//routes
app.use(`${api}/products`, productRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/user`, userRouter);
app.use(`${api}/order`, orderRouter);

//dataBase
mongoose.connect(db_connector, { dbName: 'Satyam' })
    .then(() => {
        console.log("connected")
    }).catch((err) => {
        console.log(err)
    });

app.listen(3000, () => {
    
    console.log('server is listening on http://localhost:3000')
});
