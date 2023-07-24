const control = {}
const model = require('../models/user_model')
const bcrypt = require('bcrypt');
const resp = require('../utils/responses')
const hashing = require('../utils/hashing')
const jwt = require('../utils/jwt')
const sendMail = require('../utils/sendMail')

control.getAllData = async (req, res) => {
    try {
        let { page, limit, search_name, search_phone_number } = req.query
        page = page ? parseInt(page) : 1
        limit = limit ? parseInt(limit) : 100
        search_name = search_name ? search_name : ""
        search_phone_number = search_phone_number ? search_phone_number : ""
        const id_user = req.data_jwt.id_user
        let offset = page >= 1 ? 0 + ((page - 1) * limit) : 0
        const result = await model.getAllData({ limit, offset, search_name, search_phone_number, id_user })
        if (result.rowCount == 0) throw 'data not found.'
        const result_count_data = await model.getCountData({ search_name, search_phone_number, id_user })
        const meta = {
            next: result_count_data.rows[0].count_data <= 0 ? null : page == Math.ceil(result_count_data.rows[0].count_data / limit) ? null : page + 1,
            prev: page == 1 ? null : page - 1,
            last_page: Math.ceil(result_count_data.rows[0].count_data / limit),
            total: result_count_data.rows[0].count_data
        }
        return resp(res, 200, result.rows, meta)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

control.getData = async (req, res) => {
    try {
        const id_user = req.data_jwt.id_user
        const result = await model.getData(id_user)
        if (result.rowCount == 0) throw 'data not found.'
        return resp(res, 200, result.rows)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

control.addData = async (req, res) => {
    try {
        const { first_name, last_name, phone, email, pass } = req.body
        const pass_hash = await hashing(pass)
        const result_user = await model.getDatabyEmail(email)
        if (result_user.rowCount > 0) throw 'e-mail has been registered.'
        const result = await model.addData({ first_name, last_name, phone, email, pass_hash })
        return resp(res, 200, result)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

control.updateData = async (req, res) => {
    try {
        const id_user = req.params.id
        const { first_name, last_name, email } = req.body
        const image = req.file !== undefined ? req.file.path : ''
        const result_data = await model.getData(id_user)
        if (result_data.rowCount == 0) throw 'data not found.'
        const first_email = result_data.rows[0].email
        let status_verification = 1
        let result = []
        if (email != first_email) {
            const result_user = await model.getDatabyEmail(email)
            if (result_user.rowCount > 0) throw 'e-mail has been registered.'
            status_verification = 0
            result = await model.updateData({ id_user, first_name, last_name, email, image, status_verification })

            //send verification mail
            const token_verification = jwt(email).token
            const subject_mail = 'Tickitz Verification'
            const text_mail = process.env.front_url + `/verification?token=${token_verification}`
            sendMail(email, subject_mail, text_mail)

            return resp(res, 200, 'please verify via email.')
        } else {
            result = await model.updateData({ id_user, first_name, last_name, email, image, status_verification })
        }
        return resp(res, 200, result)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

control.addPhoneNumber = async (req, res) => {
    try {
        const id_user = req.data_jwt.id_user
        const { phone } = req.body
        const result_data = await model.getData(id_user)
        if (result_data.rowCount == 0) throw 'data not found.'
        result = await model.addDataPhoneNumber({ id_user, phone })
        return resp(res, 200, result)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}
control.deletePhoneNumber = async (req, res) => {
    try {
        const id_user = req.data_jwt.id_user
        const result_data = await model.getData(id_user)
        if (result_data.rowCount == 0) throw 'data not found.'
        result = await model.deleteDataPhoneNumber({ id_user })
        return resp(res, 200, result)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

control.change_Password = async (req, res) => {
    try {
        const id_user = req.data_jwt.id_user
        const result_data = await model.getDataAll(id_user)
        let { pass, new_pass } = req.body
        const status = await bcrypt.compare(pass, result_data.rows[0].pass)
        if (!status) throw 'old password is wrong.'
        new_pass = await hashing(new_pass)
        if (result_data.rowCount == 0) throw 'data not found.'
        const result = await model.change_Password({ id_user, new_pass })
        return resp(res, 200, result)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}
control.change_Pin = async (req, res) => {
    try {
        const id_user = req.data_jwt.id_user
        const result_data = await model.getDataAll(id_user)
        let { pin } = req.body
        if (result_data.rowCount == 0) throw 'data not found.'
        const result = await model.updatePin({ id_user, pin })
        return resp(res, 200, result)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

control.deleteData = async (req, res) => {
    try {
        const id_user = req.params.id
        const result = await model.deleteAllData({ id_user })
        return resp(res, 200, result)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

module.exports = control