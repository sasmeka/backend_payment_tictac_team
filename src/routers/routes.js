// import express framework
const express = require('express')
const route = express.Router()

// import route config
const auth_route = require('./auth_route')
const transaction_route = require('./transaction_route')

route.use('/', auth_route)
route.use('/transaction', transaction_route)

// export
module.exports = route