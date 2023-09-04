const { reqBodies, apiRoutes, resBodies } = require("../constants");
let { plans } = apiRoutes;
module.exports.Plans = {
    createPlan: [
        //Creating a trip
        {
            id: 1, describe: 'Create A Plan', route: plans.createPlan, should: 'createPlan',
            status: 200, properties: ['Plan Created!'],
            method: 'post', body: reqBodies.createPlan
        },
        {
            id: 2, describe: 'Create A Plan', route: plans.createPlan, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post', body: reqBodies.createPlan
        },
        {
            id: 3, describe: 'Create A Plan', route: plans.createPlan, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post', body: reqBodies.createPlan
        },
    ],

    getPlans: [
        //Get plans
        {
            id: 1, describe: 'Get all Plans', route: plans.getAllPlans, should: 'getPlans',
            status: 200, method: 'get', body: resBodies
        },
        {
            id: 2, describe: 'Get all Plans', route: plans.getAllPlans, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get',
        },
        {
            id: 3, describe: 'Get all Plans', route: plans.getAllPlans, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get',
        },
        //Get plan
        {
            id: 4, describe: 'Get Single Plan', route: plans.getAllPlans, should: 'getPlan',
            status: 200, method: 'get', body: resBodies.plan
        },
        {
            id: 5, describe: 'Get Single Plan', route: plans.getAllPlans, should: 'notFound',
            status: 404, properties: ['not_found'], method: 'get', body: reqBodies.plan
        },
    ],

}

