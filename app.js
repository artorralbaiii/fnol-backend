'use strict'

// Vendor
let bodyParser = require('body-parser')
let cfenv = require('cfenv')
let express = require('express')
let cors = require('cors')
let mongoose = require('mongoose')

// Mongo DB Connection 
mongoose.connect('mongodb://admin:passw0rd@ds061681.mlab.com:61681/fnoldb',
    {}, (err) => (err) ? console.log(err) : console.log('Connected to database...'))

// express server
let app = express()

// Parse incoming request as JSON.
app.use(bodyParser.urlencoded({ extended: false, keepExtensions: true }))
app.use(bodyParser.json())
app.use(cors())

// API Router
let api = require('./router')(app, express)
app.use('/api', api)

// get the app environment from Cloud Foundry
let appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', () => {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
})