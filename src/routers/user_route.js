// import express framework
const express = require('express')
const route = express.Router()
const authCheck = require('../middlewares/authCheck')
// import controllers
const control = require('../controllers/user')
const upload_file = require('../middlewares/upload_files')
// const upload_file = require('../utils/uploads')

route.get('/', authCheck('user'), control.getAllData)
route.get('/bytoken', authCheck('user'), control.getData)

route.post('/add_phone_number', authCheck('user'), control.addPhoneNumber)
route.post('/', authCheck('user'), control.addData)

route.put('/change_pin', authCheck('user'), control.change_Pin)
route.put('/change_password', authCheck('user'), control.change_Password)
route.put('/:id', authCheck('user'), upload_file.single('image'), control.updateData)

route.delete('/delete_phone_number', authCheck('user'), control.deletePhoneNumber)
route.delete('/:id', authCheck('user'), control.deleteData)

//export
module.exports = route