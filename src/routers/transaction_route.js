// import express framework
const express = require('express')
const route = express.Router()
const authCheck = require('../middlewares/authCheck')
// import controllers
const control = require('../controllers/transaction')


route.get('/receiver_send', authCheck('user'), control.getReceiverSend)
route.get('/', authCheck('user'), control.getAllData)
route.post('/transfer', authCheck('user'), control.Transfer)


//export
module.exports = route