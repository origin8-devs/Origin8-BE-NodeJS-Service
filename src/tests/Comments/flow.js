const { reqBodies, apiRoutes, resBodies } = require("../constants");
let { comments } = apiRoutes;
module.exports.Comments = {
    postComments: [
        //Posting A comment
        {
            id: 1, describe: 'Post A Comment', route: comments.post, should: 'postComment',
            status: 200, properties: ['Comment Posted!'],
            method: 'post', body: reqBodies.comment
        },
        {
            id: 2, describe: 'Post A Comment', route: comments.post, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
        {
            id: 3, describe: 'Post A Comment', route: comments.post, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
    //Updating A Comment
        {
            id: 4, describe: 'Update A Comment', route: comments.update, should: 'updateComment',
            status: 200, properties: ['Comment Updated!'],
            method: 'put', body: reqBodies.comment
        },
        {
            id: 5, describe: 'Update A Comment', route: comments.update, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'put', body: reqBodies.comment
        },
        {
            id: 6, describe: 'Update A Comment', route: comments.update, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'put', body: reqBodies.comment
        },
        {
            id: 7, describe: 'Update A Comment', route: comments.update + '999999', should: 'notFound',
            status: 404, properties: ['not_found'],
            method: 'put', body: reqBodies.comment
        },
        //Getting All Comments
        {
            id: 8, describe: 'Getting All Comments', route: comments.getAll, should: 'getComments',
            status: 200, method: 'get', body: resBodies
        },
        {
            id: 9, describe: 'Getting All Comments', route: comments.getAll, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get', body: resBodies
        },
        {
            id: 10, describe: 'Getting All Comments', route: comments.getAll, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get', body: resBodies
        },
        //Deleting A Comment
        {
            id: 12, describe: 'Delete A Comment', route: comments.delete, should: 'deleteComment',
            status: 200, properties: ['Comment Deleted!'],
            method: 'delete',
        },
        {
            id: 13, describe: 'Delete A Comment', route: comments.delete, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'delete', body: resBodies
        },
        {
            id: 14, describe: 'Delete A Comment', route: comments.delete, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'delete', body: resBodies
        },
        {
            id: 15, describe: 'Delete A Comment', route: comments.delete + '999999', should: 'notFound',
            status: 404, properties: ['not_found'],
            method: 'delete', body: resBodies
        },
    ],
}

