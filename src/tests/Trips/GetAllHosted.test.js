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
    hostedTrips: 'trips/getTrips/hostedTrips/'
}
let { statusValidator, payloadTypeValidator, payloadValidator } = validatorMap;
let { getHostedTrips } = Trips;

describe('Flow - Fetching Trips', () => {
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
    getHostedTrips.map((
        { should, status, body = {}, useToken = true, properties = [],
            route, ...rest }) => {

        describe((rest.method).toUpperCase() + " - " + rest.describe, () => {
            it(testMap[should],
                (done) => {
                    chai.request(baseURL)
                    [rest.method](route +
                        (should == 'notFound' ? '999999' : should == 'getAllTrips' ? '' : userId))
                        .set('Authorization', useToken ? Token : null)
                        .set('Provider', 'Cognito')
                        .send(body)
                        .end((err, res) => {
                            if (err)
                                throw new Error(err.message)
                            statusValidator(res, status);
                            if (status == 200)
                                payloadTypeValidator(res, 'array')
                            if (status != 200)
                                payloadTypeValidator(res, 'object')
                            payloadValidator(res.body[0], body)
                            done();
                        })
                });
        })
    })

})