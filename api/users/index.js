
const router = require('express').Router()
let users = require('./crud');
const auth = require('../auth')

router.get('/login', auth.setUser, users.login)

router.get('/signup', users.signUp)

router.get('/', users.list);

router.get('/search/:query', users.search);

router.get('/:uid', users.getUser);

router.get('/perms/:uid', users.getPerms);

router.post('/toggle_perms/:uid', users.togglePermission);

module.exports = router