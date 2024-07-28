const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv/config')
const api = process.env.API_URL
const db_connector = process.env.Db_connection
const productRouter = require('./routes/product')
//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(`${api}/products`,productRouter)
mongoose.connect(db_connector, { dbName: 'Satyam' })
    .then(() => {
        console.log("connected")
    }).catch((err)=> {
    console.log(err)
    })

app.listen(3000, () => {
    
    console.log('server is listening on http://localhost:3000')
})
