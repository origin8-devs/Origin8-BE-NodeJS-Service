const chai = require('chai');
const chaiHttp = require('chai-http');
const { property } = require('lodash');
const { baseURL, users, extractToken, addParams } = require('../helpers');
const { testMap, validatorMap } = require('../constants');
const { Trips } = require('./flow');
const should = chai.should();
chai.use(chaiHttp);
const routes = {
    login: 'users/login',
    createTrip: 'trips/create'
}
let { statusValidator, valueValidator } = validatorMap;
let { createTrip } = Trips;
describe('Flow - Creating a trip', () => {
    let Token = null;
    let userId = null;
    let tripId = null;
    before((done) => {
        chai.request(baseURL)
            .post(routes.login)
            .send(users.valid)
            .end((err, res) => {
                Token = res.body.accessToken;
                userId = res.body.user.userId;
                done();
            });
    });

    createTrip.map((
        { should, status, body = {}, useToken = true, properties = [],
            route, ...rest }) => {

        describe((rest.method).toUpperCase() + " - " + rest.describe, () => {

            it(testMap[should],
                (done) => {
                    chai.request(baseURL)
                    [rest.method](route + (addParams(should, rest.method, tripId)))
                        .set('Authorization', useToken ? Token : null)
                        .set('Provider', 'Cognito')
                        .send(body)
                        .end((err, res) => {
                            if (err)
                                throw new Error(err.message)
                            if (!tripId)
                                tripId = res.body.tripId
                            statusValidator(res, status);
                            if (properties.length)
                                valueValidator(res.body, properties)
                            done();
                        })
                });
        })
    })

})