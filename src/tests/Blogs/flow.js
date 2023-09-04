const { reqBodies, apiRoutes, resBodies } = require("../constants");
let { blogs } = apiRoutes;
module.exports.Blogs = {
    createBlogs: [
        //Posting A review
        {
            id: 1, describe: 'Post A Blog', route: blogs.create, should: 'createBlog',
            status: 200, properties: ['Blog Created.'],
            method: 'post', body: reqBodies.blogs
        },
        {
            id: 2, describe: 'Post A Blog', route: blogs.create, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
        {
            id: 3, describe: 'Post A Blog', route: blogs.create, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
        {
            id: 4, describe: 'Update A Blog', route: blogs.update, should: 'updateBlog',
            status: 200, properties: ['Blog Updated.'],
            method: 'put', body: reqBodies.blogs
        },
        {
            id: 5, describe: 'Update A Blog', route: blogs.update, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'put', body: reqBodies.postReview
        },
        {
            id: 6, describe: 'Update A Blog', route: blogs.update, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'put', body: reqBodies.postReview
        },
        {
            id: 7, describe: 'Update A Blog', route: blogs.update + '999999', should: 'notFound',
            status: 404, properties: ['not_found'],
            method: 'put', body: reqBodies.blogs
        },
    ],
    getBlogs: [
        //Getting A Blog by ID
        {
            id: 1, describe: 'Get A Blog by BlogID', route: blogs.getById, should: 'getBlogByBlogId',
            status: 200, method: 'get', body: resBodies
        },
        {
            id: 2, describe: 'Post A Blog by BlogID', route: blogs.getById, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 3, describe: 'Get A Blog by BlogID', route: blogs.getById, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 4, describe: 'Get A Blog by BlogID', route: blogs.getById + '999999', should: 'notFound',
            status: 404, properties: ['not_found'],
            method: 'get', body: reqBodies
        },
        // Get All blogs.
        {
            id: 5, describe: 'Get All blogs by User', route: blogs.getAllByUser, should: 'getBlogsByUser',
            status: 200, method: 'get', body: resBodies
        },
        {
            id: 6, describe: 'Get All blogs by User', route: blogs.getAllByUser, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 7, describe: 'Get All blogs by User', route: blogs.getAllByUser, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 8, describe: 'Get All Blogs', route: blogs.getAll, should: 'getBlogs',
            status: 200, method: 'get', body: reqBodies
        },
        {
            id: 9, describe: 'Get All Blogs', route: blogs.getAllByUser, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 10, describe: 'Get All Blogs', route: blogs.getAllByUser, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
    ],
}

