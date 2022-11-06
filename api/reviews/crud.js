const knex = require('../../database/mysql');
const votes = require('../votes/crud');
const users = require('../users/crud');
const _ = require('lodash')

exports.getReviewerRatingsByIds = (ids, excludeReviews) => {
    // get rating for reviewer
    return knex('reviews')
        .select(
            'id as review_id',
            'reviewed_id',
            'review',
            'author_id',
            'review_type_id',
            knex.raw('((rating_1 + rating_2 + rating_3) / 3) rating'),
        )
        .whereIn('reviewed_id', ids)
        .then((reviewData) => {
            
            const reviewIds = reviewData.map(review => review.review_id)

            return votes.mapByReviewIds(reviewIds)
                .then((votesMap) => {
                    // get total votes for each review mapped by review id
                    const reviewsMapByUserId = reviewData.reduce((acc, curr) => {
                        const {up_votes, down_votes} = votesMap[curr.review_id]
                        let {reviews, totalUserVotes} = acc[curr.reviewed_id]
                        curr.absoluteVotes = up_votes - down_votes
                        reviews.push(curr)
                        totalUserVotes += parseInt(up_votes) + parseInt(down_votes)
                        return {
                            ...acc,
                            [curr.reviewed_id]: {
                                reviews,
                                totalUserVotes
                            }
                        }
                    }, Object.fromEntries(ids.map(id => [id, {reviews: [], totalUserVotes: 0}])))

                    // TODO update this to get votes mapped by user id
                    // for O(n) instead of O(n^2)
                    const ratingsByUserId = _.reduce(reviewsMapByUserId, (accumulator, {reviews, totalUserVotes}, user_id) => {
                        if (!reviews.length) {
                            accumulator[user_id] = {
                                userRating: 5,
                                reviews: excludeReviews ? undefined : reviews
                            }
                            return accumulator
                        }

                        const {sumWeight, sumWeighted} = reviews.reduce((acc, review) => {
                            const {rating, absoluteVotes} = review
                            const weight = rating + totalUserVotes * absoluteVotes
                            const weightedRating = weight * rating
                            acc.sumWeight += weight
                            acc.sumWeighted += weightedRating
                            return acc
                        }, {sumWeight: 0, sumWeighted: 0})

                        accumulator[user_id] = {
                            userRating: sumWeighted / sumWeight,
                            reviews: excludeReviews ? undefined : reviews
                        }
                        return accumulator
                    }, {})

                    return ratingsByUserId
                })
        })
        .catch(err => {throw new Error(err)})
}

// need to fix the user and votes table in db next
exports.getUser = (id) => {
    return knex('users')
        .select(
            'first_name',
            'last_name',
            'profession',
            'location',
            'personalQuote'
        )
        .where('id', id)
        .then(data => data[0])
}

exports.list = (req, res) => {
    const {user_id} = req.params
    return Promise.all([
        exports.getReviewerRatingsByIds([user_id]),
        exports.getUser(user_id),
    ])
    .then(([ratingAndRevsByUID, user]) => {
        if (!user) return res.status(404).send('Not Found')
        const {reviews, userRating} = ratingAndRevsByUID[user_id]
        const author_ids = [...new Set(reviews.map(review => review.author_id))]

        return Promise.all([
            exports.getReviewerRatingsByIds(author_ids, true),
            users.listByUserIds(author_ids)
        ])
        .then(([userRatingMap, userMap]) => {
            return {
                ...user,
                rating: userRating,
                reviews: reviews.map(review => {
                    const {first_name, last_name, image} = userMap[review.author_id]

                    return {
                        ...review,
                        userRating: userRatingMap[review.author_id].userRating,
                        first_name,
                        last_name,
                        image
                    }
                })
            }
        })
    })
        .then((data) => res.status(200).send(data))
        .catch(err => {throw new Error(err)})
}

exports.create = (req, res) => {}

exports.update = (req, res) => {}

exports.delete = (req, res) => {}