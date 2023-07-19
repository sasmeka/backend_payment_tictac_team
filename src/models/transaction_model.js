const db = require('../configs/database')
const escape = require('pg-format')
const model = {}

model.getData = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id_user, first_name, last_name, phone, email, status_verification, "role",image FROM public.users WHERE id_user=$1;', [id])
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.getDataBalance = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id_user, balance FROM public.users WHERE id_user=$1;', [id])
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.addBalance = ({ id_user_receiver, amount }) => {
    return new Promise((resolve, reject) => {
        db.query('update public.users set balance=balance+$2 where id_user = $1', [id_user_receiver, amount])
            .then(() => {
                resolve('add balance success.')
            }).catch((e) => {
                reject('add balance failed.')
            })
    })
}

model.reduceBalance = ({ id_user_sender, amount }) => {
    return new Promise((resolve, reject) => {
        db.query('update public.users set balance=balance-$2 where id_user = $1', [id_user_sender, amount])
            .then(() => {
                resolve('reduce balance success.')
            }).catch((e) => {
                reject('reduce balance failed.')
            })
    })
}

model.addData = ({ id_user_sender, id_user_receiver, amount, notes }) => {
    return new Promise((resolve, reject) => {
        db.query('insert into public.transaction_users (id_user_sender, id_user_receiver, amount, notes) values ($1,$2,$3,$4);', [id_user_sender, id_user_receiver, amount, notes])
            .then(() => {
                resolve('transfer success.')
            }).catch((e) => {
                reject('transfer failed.')
            })
    })
}

model.addAllData = async ({ id_user_sender, id_user_receiver, amount, notes }) => {
    try {
        const result_data = await model.getData(id_user_receiver)
        if (result_data.rowCount == 0) throw ('receiver not found.')
        const result_data_balance = await model.getDataBalance(id_user_sender)
        if (result_data_balance.rows[0].balance < amount) throw ('your balance is not enough.')
        await db.query('BEGIN')
        await model.reduceBalance({ id_user_sender, amount })
        await model.addBalance({ id_user_receiver, amount })
        const result = await model.addData({ id_user_sender, id_user_receiver, amount, notes })
        await db.query('COMMIT')
        return result
    } catch (error) {
        await db.query('ROLLBACK')
        throw error
    }
}

module.exports = model