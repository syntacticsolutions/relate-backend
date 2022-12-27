
'use strict';
var router = require('express').Router();
let { canPost } = require('../auth')
let images = require('./crud')

// router.post('/upload-to-user-space', canPost, images.uploadToBlog);

module.exports = router;