/** Third party dependencies*/
const { Router } = require('express');

/** Local dependencies and functions */
const {
    schemaValidator,
} = require('../../middlewares');
const verifyToken = require('../../middlewares/verifyToken');
const { dashboardGraph, kpiScores, productKPIList, dbStats } = require('./kpis.controller');


const router = Router();

router
    .get(
        '/scores',
        verifyToken,
        kpiScores,
    )
    .get(
        '/dashboard/graph',
        verifyToken,
        dashboardGraph,
    )
    .get(
        '/products/scores',
        verifyToken,
        productKPIList,
    )
    .get(
        '/db-stats',
        verifyToken,
        dbStats,
    )



module.exports = router;
