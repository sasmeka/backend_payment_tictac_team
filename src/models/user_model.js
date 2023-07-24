const db = require('../configs/database')
const escape = require('pg-format')
const model = {}

model.getAllData = ({ limit, offset, search_name, search_phone_number, id_user }) => {
    search_name = search_name == "" ? "" : escape("AND (LOWER(first_name) %s OR LOWER(last_name) %s)", "like LOWER('%" + search_name + "%')", "like LOWER('%" + search_name + "%')")
    search_phone_number = search_phone_number == "" ? "" : escape("AND phone %s", "like '%" + search_phone_number + "%'")
    return new Promise((resolve, reject) => {
        db.query(`SELECT id_user,username, first_name, last_name, phone, email, status_verification, "role",image,balance FROM public.users where true AND id_user!=$3 ${search_name} ${search_phone_number} ORDER BY first_name,last_name ASC LIMIT $1 OFFSET $2;`, [limit, offset, id_user])
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.getCountData = ({ search_name, search_phone_number, id_user }) => {
    search_name = search_name == "" ? "" : escape("AND (LOWER(first_name) %s OR LOWER(last_name) %s)", "like LOWER('%" + search_name + "%')", "like LOWER('%" + search_name + "%')")
    search_phone_number = search_phone_number == "" ? "" : escape("AND phone %s", "like '%" + search_phone_number + "%'")
    return new Promise((resolve, reject) => {
        db.query(`select count(id_user) as count_data from users where true ${search_name} ${search_phone_number} AND id_user!=${id_user} ;`)
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.getData = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id_user,username, first_name, last_name, phone, email, status_verification, pin, "role", image, balance FROM public.users WHERE id_user=$1;', [id])
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.getDataAll = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users WHERE id_user=$1;', [id])
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.newIdData = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT currval(pg_get_serial_sequence(\'public.users\', \'id_user\')) as new_id_user')
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}
model.getDatabyEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users WHERE email=$1 limit 1;', [email])
            .then((res) => {
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
    })
}

model.addData = ({ username, first_name, last_name, email, pass_hash }) => {
    return new Promise((resolve, reject) => {
        db.query('insert into public.users (username, first_name, last_name, email, pass, status_verification) values ($1,$2,$3,$4,$5,0);', [username, first_name, last_name, email, pass_hash])
            .then(() => {
                resolve('account has been registered, please verify via email.')
            }).catch((e) => {
                reject('user data failed to add.')
            })
    })
}

model.updateData = ({ id_user, first_name, last_name, email, image, status_verification }) => {
    image = image == "" ? "" : escape(", image=%L", image)
    return new Promise((resolve, reject) => {
        db.query(`update public.users SET first_name=$2, last_name=$3, email=$4, status_verification=$5 ${image} where id_user = $1;`, [id_user, first_name, last_name, email, status_verification])
            .then(() => {
                resolve('user data successfully updated.')
            }).catch(() => {
                reject('user data failed to update.')
            })
    })
}

model.updatePin = ({ id_user, pin }) => {
    return new Promise((resolve, reject) => {
        db.query(`update public.users SET pin=$2 where id_user = $1;`, [id_user, pin])
            .then(() => {
                resolve('PIN successfully updated.')
            }).catch(() => {
                reject('PIN failed to update.')
            })
    })
}

model.addDataPhoneNumber = ({ id_user, phone }) => {
    return new Promise((resolve, reject) => {
        db.query(`update public.users SET phone=$2 where id_user = $1;`, [id_user, phone])
            .then(() => {
                resolve('phone number successfully added.')
            }).catch(() => {
                reject('phone number failed to add.')
            })
    })
}

model.deleteDataPhoneNumber = ({ id_user }) => {
    return new Promise((resolve, reject) => {
        db.query(`update public.users SET phone=NULL where id_user = $1;`, [id_user])
            .then(() => {
                resolve('phone number successfully deleted.')
            }).catch(() => {
                reject('phone number failed to delete.')
            })
    })
}

model.change_Password = ({ id_user, new_pass }) => {
    return new Promise((resolve, reject) => {
        db.query(`update public.users SET pass=$2 where id_user = $1;`, [id_user, new_pass])
            .then(() => {
                resolve('change password successfully.')
            }).catch(() => {
                reject('change password failed.')
            })
    })
}

model.verification = ({ result_id, result_email }) => {
    return new Promise((resolve, reject) => {
        db.query('update public.users SET status_verification=1 where id_user = $1 and email=$2;', [result_id, result_email])
            .then(() => {
                resolve('verified account successfully.')
            }).catch(() => {
                reject('verified account failed.')
            })
    })
}

model.changeForgetPassword = ({ result_id, result_email, pass_hash }) => {
    return new Promise((resolve, reject) => {
        db.query('update public.users SET pass=$3 where id_user = $1 and email=$2;', [result_id, result_email, pass_hash])
            .then(() => {
                resolve('change forget password successfully.')
            }).catch(() => {
                reject('change forget password failed.')
            })
    })
}

model.deleteData = ({ id_user }) => {
    return new Promise((resolve, reject) => {
        db.query('delete from public.users where id_user=$1', [id_user])
            .then(() => {
                resolve('user data successfully deleted.')
            }).catch(() => {
                reject('user data failed to delete.')
            })
    })
}

model.deleteAllData = async ({ id_user }) => {
    try {
        const result_data = await model.getData(id_user)
        if (result_data.rowCount == 0) throw ('data not found.')
        await db.query('BEGIN')
        const result = await model.deleteData({ id_user })
        await db.query('COMMIT')
        return result
    } catch (error) {
        await db.query('ROLLBACK')
        throw error
    }
}

module.exports = model