'use strict';
const router = require('express').Router();
const reviews = require('./crud');

router.get('/:user_id', reviews.list);

router.put('/:id', reviews.update);

router.post('/', reviews.create);

router.delete('/:id', reviews.delete);

module.exports = router