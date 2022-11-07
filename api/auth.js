// Get this credentials file from the Firebase console.
let serviceAccount = require('../firebase-auth-key.json');
const firebaseAdmin = require('firebase-admin')


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});
// Import the package

const processAuth = (req) => {
    const authorizationHeader = req.headers['authorization'] || '';
    if (!authorizationHeader) return null
    const idToken = authorizationHeader.split(' ').pop();
    
    return firebaseAdmin
        .auth()
        .verifyIdToken(idToken)
        .catch(console.log)
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

            // if (!user.email_verified) {
            //     return Promise.reject({ error: 'Email Unverified!' })
            // }

            res.locals.user = user; // Set the user object to locals
            return next();
    })
    .catch(err => res.status(403).send('forbidden'))
}

const setUser = async (req, res, next) => {
    res.locals.user = await processAuth(req, res)
    next()
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