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

model.addData = ({ id_user_sender, id_user_receiver, amount, notes, create_at }) => {
    return new Promise((resolve, reject) => {
        db.query('insert into public.transaction_users (id_user_sender, id_user_receiver, amount, notes,create_at) values ($1,$2,$3,$4,$5);', [id_user_sender, id_user_receiver, amount, notes, create_at])
            .then(() => {
                resolve('transfer success.')
            }).catch((e) => {
                reject('transfer failed.')
            })
    })
}

model.addAllData = async ({ id_user_sender, id_user_receiver, amount, notes, create_at }) => {
    try {
        const result_data = await model.getData(id_user_receiver)
        if (result_data.rowCount == 0) throw ('receiver not found.')
        const result_data_balance = await model.getDataBalance(id_user_sender)
        if (result_data_balance.rows[0].balance < amount) throw ('your balance is not enough.')
        await db.query('BEGIN')
        await model.reduceBalance({ id_user_sender, amount })
        await model.addBalance({ id_user_receiver, amount })
        const result = await model.addData({ id_user_sender, id_user_receiver, amount, notes, create_at })
        await db.query('COMMIT')
        return result
    } catch (error) {
        await db.query('ROLLBACK')
        throw error
    }
}

model.getAllData = ({ limit, offset, id_user, show_data_by }) => {
    id_user = id_user == "" ? "" : escape("AND (tu.id_user_sender=%L OR tu.id_user_receiver=%L)", id_user, id_user)
    show_data_by = show_data_by == '' ? '' : show_data_by == 'week' ? escape("and tu.create_at >= now()-interval '6 day' AND EXTRACT(MONTH FROM tu.create_at)=EXTRACT(MONTH FROM now()) AND EXTRACT(YEAR FROM tu.create_at)=EXTRACT(YEAR FROM now())") : show_data_by == 'month' ? escape("AND EXTRACT(MONTH FROM tu.create_at)=EXTRACT(MONTH FROM now()) AND EXTRACT(YEAR FROM tu.create_at)=EXTRACT(YEAR FROM now())") : show_data_by == 'day' ? escape("AND EXTRACT(YEAR FROM tu.create_at)=EXTRACT(YEAR FROM now()) AND EXTRACT(MONTH FROM tu.create_at)=EXTRACT(MONTH FROM now()) AND EXTRACT(DAY FROM tu.create_at)=EXTRACT(DAY FROM now())") : ''
    return new Promise((resolve, reject) => {
        db.query(`SELECT tu.id_transaction ,tu.amount,tu.notes ,tu.create_at ,us.user_data_sender,ur.user_data_receiver FROM public.transaction_users tu 
        left join (select id_user, json_agg(jsonb_build_object('id_user',id_user,'first_name',first_name,'last_name',last_name,'username',username,'phone',phone,'image',image)) as user_data_sender from users group by id_user) as us on tu.id_user_sender =us.id_user
        left join (select id_user, json_agg(jsonb_build_object('id_user',id_user,'first_name',first_name,'last_name',last_name,'username',username,'phone',phone,'image',image)) as user_data_receiver from users group by id_user) as ur on tu.id_user_receiver=ur.id_user where true ${id_user} ${show_data_by} ORDER BY tu.create_at DESC LIMIT $1 OFFSET $2;`, [limit, offset])
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.getCountData = ({ id_user, show_data_by }) => {
    id_user = id_user == "" ? "" : escape("AND (id_user_sender=%L OR id_user_receiver=%L)", id_user, id_user)
    show_data_by = show_data_by == '' ? '' : show_data_by == 'week' ? escape("and create_at >= now()-interval '6 day' AND EXTRACT(MONTH FROM create_at)=EXTRACT(MONTH FROM now()) AND EXTRACT(YEAR FROM create_at)=EXTRACT(YEAR FROM now())") : show_data_by == 'month' ? escape("AND EXTRACT(MONTH FROM create_at)=EXTRACT(MONTH FROM now()) AND EXTRACT(YEAR FROM create_at)=EXTRACT(YEAR FROM now())") : show_data_by == 'day' ? escape("AND EXTRACT(YEAR FROM create_at)=EXTRACT(YEAR FROM now()) AND EXTRACT(MONTH FROM create_at)=EXTRACT(MONTH FROM now()) AND EXTRACT(DAY FROM create_at)=EXTRACT(DAY FROM now())") : ''
    return new Promise((resolve, reject) => {
        db.query(`select count(id_transaction) as count_data from public.transaction_users where true ${id_user} ${show_data_by} ; `)
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.getTotalSend = ({ id_user }) => {
    return new Promise((resolve, reject) => {
        db.query(`select sum(amount) as total_send from public.transaction_users where true and create_at >= now()-interval '6 day' AND EXTRACT(MONTH FROM create_at)=EXTRACT(MONTH FROM now()) AND EXTRACT(YEAR FROM create_at)=EXTRACT(YEAR FROM now()) AND id_user_sender =${id_user}`)
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.getTotalReceiver = ({ id_user }) => {
    return new Promise((resolve, reject) => {
        db.query(`select sum(amount) as total_receiver from public.transaction_users where true and create_at >= now()-interval '6 day' AND EXTRACT(MONTH FROM create_at)=EXTRACT(MONTH FROM now()) AND EXTRACT(YEAR FROM create_at)=EXTRACT(YEAR FROM now()) AND id_user_receiver =${id_user}`)
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

module.exports = model