const { reqBodies, apiRoutes: routes, apiRoutes, resBodies } = require("../constants");
let { trips } = apiRoutes;
module.exports.Trips = {
    createTrip: [
        //Creating a trip
        {
            id: 1, describe: 'Create A Trip', route: trips.createTrip, should: 'createTrip',
            status: 200, properties: ['Trip Created!'],
            method: 'post', body: reqBodies.createTrip,
        },
        {
            id: 2, describe: 'Create A Trip', route: trips.createTrip, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
        {
            id: 3, describe: 'Create A Trip', route: trips.createTrip, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
        //Adding Trip Keys
        {
            id: 4, describe: 'Adding Trip Keys', route: trips.createTrip, should: 'addSingleKeys',
            status: 200, properties: ['Trip updated!'],
            method: 'put', body: reqBodies.addSingleKeys
        },
        {
            id: 5, describe: 'Adding Trip Keys', route: trips.createTrip, should: 'emptyBody',
            status: 200, properties: ['validation_error'],
            method: 'put'
        },
        {
            id: 6, describe: 'Adding Trip Keys', route: trips.createTrip, should: 'notFound',
            status: 404, properties: ['not_found'],
            method: 'put', body: reqBodies.addSingleKeys
        },
        //Adding Day Details
        {
            id: 7, describe: 'Adding Day Details', route: trips.addDayDetails, should: 'addDayDetails',
            status: 200, properties: ['Day Updated!'],
            method: 'put', body: reqBodies.addDayDetails
        },
        {
            id: 8, describe: 'Adding Day Details', route: trips.addDayDetails, should: 'emptyBody',
            status: 200, properties: ['validation_error'],
            method: 'put'
        },
        {
            id: 9, describe: 'Adding Day Details', route: trips.addDayDetails, should: 'notFound',
            status: 404, properties: ['not_found'],
            method: 'put', body: reqBodies.addDayDetails
        },
        //Publishing trip
        {
            id: 10, describe: 'Publishing Trip', route: trips.publishTrip, should: 'publishTrip',
            status: 200, properties: ['Trip Published!'],
            method: 'put', body: reqBodies.addDayDetails
        },
        {
            id: 11, describe: 'Publishing Trip', route: trips.publishTrip,
            should: 'alreadyPublished', status: 400, properties: ['already_published'],
            method: 'put'
        },
        {
            id: 12, describe: 'Publishing Trip', route: trips.publishTrip,
            should: 'notFound', status: 404, properties: ['not_found'],
            method: 'put'
        },
    ],

    getBookedTrips: [
        //Get trips
        {
            route: trips.createTrip, should: 'createTrip',
            status: 200, properties: ['Trip Created!'],
            method: 'post', body: reqBodies.createTrip,
        },
        {
            route: trips.createTrip, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
        {
            route: trips.createTrip, should: 'InvalidToken',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'post'
        },
    ],

    getHostedTrips: [
        //Get Hosted trips
        {
            id: 1, describe: 'Get All Hosted Trips', route: trips.getHostedTrips,
            should: 'getHostedTrips', status: 200, method: 'get', body: reqBodies.trip,
        },
        {
            id: 2, describe: 'Get All Hosted Trips', route: trips.getHostedTrips,
            should: 'TrialExpired', status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 3, describe: 'Get All Hosted Trips', route: trips.getHostedTrips,
            should: 'InvalidToken', status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 4, describe: 'Get All Hosted Trips', route: trips.getHostedTrips,
            should: 'notFound', status: 404, properties: ['not_found'],
            method: 'get'
        },
        //Get All trips
        {
            id: 5, describe: 'Get All Trips', route: trips.getAllTrips,
            should: 'getAllTrips', status: 200, method: 'get'
        },
    ],

    getTripById: [
        //Get trip
        {
            id: 1, route: trips.getTripById, should: 'getTripById',
            status: 200, method: 'get', body: resBodies.gerTripById,
        },
        {
            id: 2, route: trips.getTripById, should: 'InvalidToken',
            status: 403, properties: ['Trip Created!'],
            method: 'get', useToken: false
        },
        {
            id: 3, route: trips.getTripById, should: 'TrialExpired',
            status: 403, properties: ['TrialExpired'], useToken: false,
            method: 'get'
        },
        {
            id: 4, route: trips.getTripById, should: 'notFound',
            status: 404, properties: ['not_found'],
            method: 'get'
        },
    ]

}

