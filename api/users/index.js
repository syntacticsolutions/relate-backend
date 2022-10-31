'use strict';
const router = require('express').Router()
let users = require('./crud');
const { Router } = require('express');

router.get('/', users.list);

router.get('/:uid', users.getUser);

router.get('/perms/:uid', users.getPerms);

router.post('/toggle_perms/:uid', users.togglePermission)

router.post('/login', users.login)

router.post('/signup', users.signUp)

module.exports = router