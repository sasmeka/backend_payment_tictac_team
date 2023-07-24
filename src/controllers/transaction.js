const control = {}
const model = require('../models/transaction_model')
const resp = require('../utils/responses')

control.Transfer = async (req, res) => {
    try {
        const { id_user_receiver, amount, notes, create_at } = req.body
        const id_user_sender = req.data_jwt.id_user
        const result = await model.addAllData({ id_user_sender, id_user_receiver, amount, notes, create_at })
        return resp(res, 200, result)
    } catch (e) {
        console.log(e)
        return resp(res, 500, e)
    }
}

control.getAllData = async (req, res) => {
    try {
        let { page, limit, show_data_by } = req.query
        const id_user = req.data_jwt.id_user
        page = page ? parseInt(page) : 1
        limit = limit ? parseInt(limit) : 100
        let offset = page >= 1 ? 0 + ((page - 1) * limit) : 0
        const result = await model.getAllData({ limit, offset, id_user, show_data_by })
        if (result.rowCount == 0) throw 'data not found.'
        const result_count_data = await model.getCountData({ id_user, show_data_by })
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

module.exports = control