// import express framework
const express = require('express')
const route = express.Router()

// import route config
const auth_route = require('./auth_route')

route.use('/', auth_route)

// export
module.exports = route