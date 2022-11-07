const router = require('express').Router()

router.use('/users/reviews', require('./reviews'))

router.use('/users', require('./users'))

router.use('/votes', require('./votes'))

router.use('/roles', require('./roles'))

router.use('/comments', require('./comments'))

module.exports = router