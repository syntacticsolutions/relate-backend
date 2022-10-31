const knex = require('../../database/mysql');
const { firebaseAdmin } = require('../auth')
const { validate } = require('../validation');
const _ = require('lodash');

exports.listByUserIds = (ids) => {
    return knex('users')
        .select('id', 'first_name', 'last_name', 'image')
        .whereIn('id', ids)
        .then(data => {
            return _.keyBy(data, 'id')
        })
        .catch(err => {throw new Error(err)})
}

exports.list = (req, res) => {
    return firebaseAdmin.auth().listUsers(1000)
        .then(function(listUsersResult) {
            listUsersResult.users.forEach(function(userRecord) {
                userRecord = userRecord.toJSON();
            })

            req.headers.pageToken = listUsersResult.pageToken
            return res.status(200).json(listUsersResult.users)
        })
        .catch(function(error) {
            console.log("Error listing users:", error);
        });
};

exports.getUser = (req, res) => {
    let {uid} = req.params
    return knex('users')
        .select('*')
        .where({uid})
        .then(data => {
            if (!data[0]) return res.status(404).send('Forbidden')
            else return res.status(200).send(data[0])
        })
        .catch(err => {throw new Error(err)})
}

exports.getPerms = (req, res) => {
    return knex('users')
    .select('perms', 'id')
    .where({ uid: req.params.uid })
    .then(([user]) => {
        if (!user) {
            return knex('users')
            .insert({ uid: req.params.uid, perms: 'comment' })
            .then(([row]) => {
                if (!row) return res.status(206).send(['comment'])
                return res.status(201).send(['comment'])
            })
            .catch(err => res.status(500).send(err))
        }
        else return res.status(200).send(user.perms.split(','))
    })
    .catch(err => {
        return res.status(500).send(err)
    })
} 

exports.togglePermission = (req, res) => {
    let body
    if (!(body = validate(req.body, ['perms']))) {
        return res.status(412).send('Error: Precondition Failed')
    }

    return knex('users')
    .update({ perms: body.perms })
    .where({ uid: req.params.uid})
    .then(async rows => {
        if (!rows) return res.status(404).send('Record not found')
        try {
            await firebaseAdmin.auth().setCustomUserClaims(req.params.uid, { perms: body.perms.split(',') })
        } catch (err)  {
            console.log(err)
            Promise.reject(err)
        }
    })
    .then(() => res.status(200).send('Success!'))
    .catch(err => res.status(500).send(err))
}

exports.signUp = async (req, res) => {
    let {uid, email} = req.body
    let id = await createUser(uid, email)

    return exports
        .getUser({params: {uid}})
        .then(res => {
            if (!res[0]) throw new Error('404: Not Found')
            return res.status(200).send(res[0])
        })
}

let createUser = (uid, email) => {
    return knex('users').insert({
        uid,
        email,
        role_id: 3
    })
    .then(res => {
        return res
    })
    .catch(err => { throw new Error(err) })
}

exports.login = (req, res) => {
    let {uid, email} = req.body
    return knex('users')
        .where({uid})
        .then(async data => {
            if (!data[0]) {
                let id = await createUser(uid, email)
                return exports.getUser({params: {uid}}, res)
            }
            else return res.status(200).send(data[0])
        })

}