const knex = require('../../database/mysql');
const _ = require('lodash');

exports.mapTotalVotesByReviewIds = (ids) => {
    return knex('votes')
        .select(
            'review_id',
            knex.raw('COUNT(*) as total_votes')
        )
        .whereIn('review_id', ids)
        .then(
            _.curryRight(
                _.keyBy
            )('review_id')
        )
}

exports.mapByReviewIds = (ids) => {

    return knex('votes')
        .select(
            knex.raw('SUM(votes.liked) as up_votes'),
            knex.raw('COUNT(*) - SUM(votes.liked) as down_votes'),
            knex.raw('COUNT(*) as total_votes')
        )
        .whereIn('review_id', ids)
        .groupBy('review_id')
        .then(data => {
            return data.reduce((acc, curr) => {
                acc[curr.review_id] = curr.up_votes - curr.down_votes
                return acc
            })
        })
        .catch(err => {throw new Error(err)})
}