const knex = require('../../database/mysql');
const votes = require('../votes/crud');
const users = require('../users/crud');

exports.getReviewerRatingsByIds = (ids) => {
    return knex('reviews')
        .select(
            'id as review_id',
            'reviewed_id',
            knex.raw('((rating_1 + rating_2 + rating_3) / 3) rating'))
        .whereIn('reviewed_id', ids)
        .then((reviewData) => {

            const reviewIds = reviewData.map(review => review.review_id)

            return votes.mapByReviewIds(reviewIds)
                .then((votesMap) => {
                    const reviewsMapByUserId = reviewData.reduce((acc, curr) => {
                        const {up_votes, down_votes} = votesMap[curr.review_id]
                        const {reviews, totalUserVotes} = acc[curr.reviewed_id] || {reviews: [], totalUserVotes: 0}
                        reviews.push(curr)
                        totalUserVotes += up_votes + down_votes
                        return {
                            ...acc,
                            [curr.reviewed_id]: {
                                reviews,
                                totalUserVotes
                            }
                        }
                    }, {})
                    // TODO update this to get votes mapped by user id
                    // for O(n) instead of O(n^2)
                    const ratingsByUserId = _.map(reviewsMapByUserId, ({reviews}) => {
                        const {sumWeight, sumWeighted} = reviews.reduce((acc, review) => {
                            const {rating, votes: {totalVotes}} = review
                            let {sumWeight = 0, sumWeighted = 0} = acc
                            sumWeight  += totalUserVotes + rating * totalVotes
                            sumWeighted += weight * rating 
                            return {
                                sumWeight,
                                sumWeighted
                            }
                        }, {})
                        return {
                            rating: sumWeight / sumWeighted
                        }
                    })

                    return ratingsByUserId
                })
            


            // return data.reduce((acc, curr) => {
            //     acc[curr.author_id] = curr.rating
            //     return acc
            // })
        })
        .catch(err => {throw new Error(err)})
}

exports.list = (req, res) => {

    return knex('reviews')
        .select(
            'review',
            'author_id',
            'id',
            'review_type_id',
            knex.raw('((rating_1 + rating_2 + rating_3) / 3) rating'),
        )
        .where({ reviewed_id: req.params.user_id })
        .groupBy('reviews.id')
        .then(data => {
            if (!data[0]) return res.status(200).send(data)
            const author_ids = data.map(review => review.author_id)
            return Promise.all([
                votes.mapByReviewIds( data.map(review => review.id) ),
                exports.getReviewerRatingsByIds(author_ids),
                users.listByUserIds(author_ids)
            ])
            .then(([votesMap, userRatingMap, userMap]) => {
                return data.map(review => {
                    const {first_name, last_name, image} = userMap[review.author_id]

                    return {
                        ...review,
                        votes: votesMap[review.id],
                        userRating: userRatingMap[review.author_id],
                        first_name,
                        last_name,
                        image
                    }
                })
            })
        })
        .then((data) => res.status(200).send(data))
        .catch(err => {throw new Error(err)})
}

exports.create = (req, res) => {}

exports.update = (req, res) => {}

exports.delete = (req, res) => {}