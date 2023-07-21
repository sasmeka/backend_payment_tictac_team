// import express framework
const express = require('express')
const route = express.Router()
const authCheck = require('../middlewares/authCheck')
// import controllers
const control = require('../controllers/auth')
const cookieparser = require('cookie-parser');
route.use(cookieparser());

// route.get('/', authCheck('admin', 'user'), control.home)
route.get('/refresh_token', control.refresh)
route.get('/verification', control.verification)
route.post('/login', control.login)
route.post('/register', control.register)
route.post('/reset_password', control.sendEmailForgetPass)
route.post('/change_forget_password', control.changeForgetPassword)

//export
module.exports = route