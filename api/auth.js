// Get this credentials file from the Firebase console.
let serviceAccount = require('../firebase-auth-key.json');
const firebaseAdmin = require('firebase-admin')


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});
// Import the package

const processAuth = (req, res) => {
        return new Promise((resolve, reject) => {
            
            /**
                @desc - check if authorization header is present
            */
            const authorizationHeader = req.headers['authorization'];
            if (!authorizationHeader) reject({ Error: 'Forbidden' })
            const idToken = authorizationHeader.split(' ').pop();
            
            /**
                @desc - verify the token
            */
            return firebaseAdmin
            .auth()
            .verifyIdToken(idToken)
            .then(user => {
                resolve(user)
            })
            .catch(err => reject(err))
        })
}

const isAdmin = (req, res, next) => {
    return processAuth(req, res)
    .then((user) => {

            if (!user.perms.includes('admin')) {
                return Promise.reject({ error: 'You are not authorized!' })
            }

            res.locals.user = user; // Set the user object to locals
            next();
    })
    .catch(err => res.status(403).send('forbidden'))
}

const isUser = (req, res, next) => {
    next()
}

const canPost = (req, res, next) => {
    return processAuth(req, res)
    .then(user => {
        if (!user.perms.includes('post') && !user.perms.includes('admin')) {
            return Promise.reject({ error: 'You are not authorized!' })
        }

        res.locals.user = user; // Set the user object to locals
        next();
    })
    .catch(err => res.status(403).send(err))
}

const isAuthenticated = (req, res, next) => {
    return processAuth(req, res)
    .then(user => {

            if (!user.email_verified) {
                return Promise.reject({ error: 'Email Unverified!' })
            }

            res.locals.user = user; // Set the user object to locals
            next();
    })
    .catch(err => res.status(403).send('forbidden'))
}

const setUser = (req, res, next) => {
    return processAuth(req, res)
    .then(user => {
            res.locals.user = user;
            next();
    })
    .catch(() => next())
}

const getPerms = (req, res) => {
    return processAuth(req, res)
    .then(({ perms }) => res.status(200).send(perms))
    .catch(() => res.status(200).send([]))
} 

module.exports = {
    isAuthenticated,
    isAdmin,
    firebaseAdmin,
    isUser,
    canPost,
    setUser,
    getPerms
}