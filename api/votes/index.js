'use strict';
const votes = require('./crud');
const router = require('express').Router();

router.post('/:review_id', votes.vote);

module.exports = router