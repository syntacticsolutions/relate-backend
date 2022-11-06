const knex = require('../../database/mysql');
const _ = require('lodash');

exports.mapTotalVotesByUserIds = (ids) => {
    return knex('votes')
        .select(
            'user_id',
            knex.raw('COUNT(*) as total_votes')
        )
        .whereIn('user_id', ids)
        .then(
            _.curryRight(
                _.keyBy
            )('user_id')
        )
}

exports.mapByReviewIds = (ids) => {
    return knex('votes')
        .select(
            'review_id',
            knex.raw('SUM(votes.liked) as up_votes'),
            knex.raw('COUNT(*) - SUM(votes.liked) as down_votes'),
        )
        .whereIn('review_id', ids)
        .groupBy('review_id')
        .then(
            _.curryRight(
                _.keyBy
            )('review_id')
        )
        .catch(err => {throw new Error(err)})
}

exports.vote = (req, res) => {
    const {review_id, liked, user_id} = req.body
    const {user_id: author_id} = req.user
    const vote = {
        user_id,
        author_id,
        review_id,
        liked
    }

    return knex('votes')
        .insert(vote)
        .then((data) => res.status(200).send(data))
        .catch(err => res.status(500).send(err))
}