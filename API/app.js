//load our app server using express
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

// Database
const db = require('./api/config/database');

db.sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err))


//Cors Error
//header 
app.use((req, res, next) => {
    //who can access (* = all)
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, api_key")
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

//Declaring the constants of routes
const userRoutes = require('./api/routes/users')
const companyRoutes = require('./api/routes/company')
const authRoutes = require('./api/routes/auth')
const eventRoutes = require('./api/routes/event')

//app.use(morgan('dev'))
app.use(morgan('short'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Routes which should handle requests
app.use('/users', userRoutes)
app.use('/company', companyRoutes)
app.use('/auth', authRoutes)
app.use('/event', eventRoutes)
app.use('/uploads/User', express.static('uploads/User'))
app.use('/uploads/Company', express.static('uploads/Company'))
app.use('/uploads/Event', express.static('uploads/Event'))

app.get('/', (req, res) => {
    res.send('Api Event Day')
})

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    if (error.code != undefined) {
        res.json({
            status: 0,
            error: {
                message: error.message,
                code: error.code
            }
        })
    } else {
        res.json({
            status: 0,
            error: {
                message: error.message
            }
        })
    }
})

module.exports = app