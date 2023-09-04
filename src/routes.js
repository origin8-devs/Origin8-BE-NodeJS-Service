/** Third party dependencies */
const express = require('express');


const router = express.Router(); // eslint-disable-line new-cap
const rootRouter = express.Router(); // eslint-disable-line new-cap

// Main Routes
const users = require('./modules/users/users.routes');
const products = require('./modules/products/products.routes');
const orders = require('./modules/orders/orders.routes');
const kpis = require('./modules/kpis/kpis.routes');

// Utility Route
const utils = require('./modules/utils/utils.routes');


const routeNotFoundHandler = (req, res, next) => {
    res
        .status(404)
        .send({ message: 'routenotfound' })
}

const healthCheckHandler = (req, res, next) => {
    res.send(200);
}



/** GET /health-check - zzzCheck service health */
router
    .get(
        '/health-check',
        (req, res, next) => res.send('OK')
    );


router.use('/users', users);
router.use('/utils', utils);
router.use('/products', products);
router.use('/orders', orders);
router.use('/kpis', kpis);

router
    .all(
        '*',
        routeNotFoundHandler
    );

/** Root router */
rootRouter
    .get(
        '/',
        healthCheckHandler,
    );

rootRouter
    .get(
        '/health-check',
        healthCheckHandler,
    );

rootRouter
    .all(
        '*',
        routeNotFoundHandler
    );

module.exports = {
    router,
    rootRouter,
};
