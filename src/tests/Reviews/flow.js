const { reqBodies, apiRoutes, resBodies } = require("../constants");
let { reviews } = apiRoutes;
module.exports.Reviews = {
    postReview: [
        //Posting A review
        {
            id: 1, describe: 'Post A Review', route: reviews.post, should: 'postReview',
            status: 200, properties: ['Review Posted.'],
            method: 'post', body: reqBodies.postReview
        },
        {
            id: 2, describe: 'Post A Review', route: reviews.post, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
        {
            id: 3, describe: 'Post A Review', route: reviews.post, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
        {
            id: 4, describe: 'Update A Review', route: reviews.update, should: 'updateReview',
            status: 200, properties: ['Review Updated.'],
            method: 'put', body: reqBodies.postReview
        },
        {
            id: 5, describe: 'Update A Review', route: reviews.update, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'put', body: reqBodies.postReview
        },
        {
            id: 6, describe: 'Update A Review', route: reviews.update, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'put', body: reqBodies.postReview
        },
    ],
    getReviews: [
        //Getting A review
        {
            id: 1, describe: 'Get A Review', route: reviews.getOne, should: 'getReview',
            status: 200, method: 'get', body: resBodies
        },
        {
            id: 2, describe: 'Get A Review', route: reviews.getOne, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 3, describe: 'Get A Review', route: reviews.getOne, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 4, describe: 'Get A Review', route: reviews.getOne + '999999', should: 'notFound',
            status: 404, properties: ['not_found'],
            method: 'get', body: reqBodies
        },
        //Get All Reviews.
        {
            id: 5, describe: 'Get All Reviews', route: reviews.getAll, should: 'getReviews',
            status: 200, method: 'get', body: resBodies
        },
        {
            id: 6, describe: 'Get All Reviews', route: reviews.getAll, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 7, describe: 'Get All Reviews', route: reviews.getAll, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 8, describe: 'Get All Review', route: reviews.getAll + '999999', should: 'notFound',
            status: 404, properties: ['not_found'],
            method: 'get', body: reqBodies
        },
    ],
}

