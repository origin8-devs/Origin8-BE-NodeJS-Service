/** Third party dependencies*/
const { Router } = require('express');


/** Local dependencies and functions */
const {
    schemaValidator,
} = require('../../middlewares');
const { login, updateAccount, getUserProfile } = require('./users.controller');
const verifyToken = require('../../middlewares/verifyToken');


const router = Router();

router
    .post(
        '/login',
        login,
    )
    .put(
        '/update',
        schemaValidator('updateAccount'),
        verifyToken,
        updateAccount,
    )
    .get(
        '/profile',
        verifyToken,
        getUserProfile,
    )

module.exports = router;
