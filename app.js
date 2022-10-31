'use strict';
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require("cors");
const port = 3000
require('dotenv').config()

if (process.env.NODE_ENV === 'development') {
    app.use(cors())
}
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', require('./api'))

app.listen(port, () =>
    console.log(`Relate listening at http://localhost:${port}`)
)