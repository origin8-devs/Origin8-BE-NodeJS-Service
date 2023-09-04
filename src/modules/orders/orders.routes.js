/** Third party dependencies*/
const { Router } = require('express');

/** Local dependencies and functions */
const {
    schemaValidator,
} = require('../../middlewares');
const verifyToken = require('../../middlewares/verifyToken');
const { orderList, getOrder, update, create } = require('./orders.controller');


const router = Router();

router
    .get(
        '/',
        verifyToken,
        orderList,
    )
    .get(
        '/:id',
        verifyToken,
        getOrder,
    )
    .put(
        '/:id',
        verifyToken,
        schemaValidator('updateOrder'),
        update,
    )
    .post(
        '/create',
        verifyToken,
        schemaValidator('createOrder'),
        create,
    )


module.exports = router;
