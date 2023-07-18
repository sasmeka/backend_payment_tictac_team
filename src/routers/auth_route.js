// import express framework
const express = require('express')
const route = express.Router()
const authCheck = require('../middlewares/authCheck')
// import controllers
const control = require('../controllers/auth')
// const cookieparser = require('cookie-parser');
// route.use(cookieparser());

route.get('/', control.home)

//export
module.exports = route