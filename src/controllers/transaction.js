const control = {}
const model = require('../models/transaction_model')
const resp = require('../utils/responses')

control.Transfer = async (req, res) => {
    try {
        const { id_user_receiver, amount, notes } = req.body
        const id_user_sender = req.data_jwt.id_user
        const result = await model.addAllData({ id_user_sender, id_user_receiver, amount, notes })
        return resp(res, 200, result)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

module.exports = control