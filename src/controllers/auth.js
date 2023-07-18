const control = {}
const bcrypt = require('bcrypt');
const jwebt = require('jsonwebtoken')
// const model = require('../models/user_model')
const resp = require('../utils/responses')
const jwt = require('../utils/jwt')
const sendMail = require('../utils/sendMail')
const hashing = require('../utils/hashing');

control.home = async (req, res) => {
    try {
        return resp(res, 200, 'WELCOME ! :)')
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

module.exports = control