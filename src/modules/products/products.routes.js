/** Third party dependencies*/
const { Router } = require('express');

/** Local dependencies and functions */
const {
    schemaValidator,
} = require('../../middlewares');
const verifyToken = require('../../middlewares/verifyToken');
const { productList, getProduct, update, create } = require('./products.controller');


const router = Router();

router
    .put(
        '/list',
        verifyToken,
        productList,
    )
    .get(
        '/:id',
        verifyToken,
        getProduct,
    )
    .put(
        '/:id',
        verifyToken,
        schemaValidator('updateProduct'),
        update,
    )
    .post(
        '/create',
        verifyToken,
        schemaValidator('createProduct'),
        create,
    )


module.exports = router;
