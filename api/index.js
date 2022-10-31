const router = require('express').Router()

router.use('/users', require('./users'))

router.use('/users/reviews', require('./reviews'))

router.use('/votes', require('./votes'))

router.use('/roles', require('./roles'))

router.use('/comments', require('./comments'))

router.use('/review-categories', require('./users'))

module.exports = router