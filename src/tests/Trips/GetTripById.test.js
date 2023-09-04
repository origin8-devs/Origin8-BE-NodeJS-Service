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
let { statusValidator, payloadValidator } = validatorMap;
let { getTripById } = Trips;
describe('Get - Trip By ID', () => {
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
    before((done) => {
        chai.request(baseURL)
            .get(routes.hostedTrips + userId)
            .set('Authorization', Token)
            .set('Provider', 'Cognito')
            .send(users.valid)
            .end((err, res) => {
                tripId = res.body[0].tripId
                done();
            });
    });
    getTripById.map((
        { should, status, body = {}, useToken = true, properties = [],
            route, ...rest }) => {
        it(testMap[should],
            (done) => {
                chai.request(baseURL)
                [rest.method](route +
                    (should == 'notFound' ? '999999' : tripId))
                    .set('Authorization', useToken ? Token : null)
                    .set('Provider', 'Cognito')
                    .send(body)
                    .end((err, res) => {
                        if (err)
                            throw new Error(err.message)
                        statusValidator(res, status);
                        if (body)
                            payloadValidator(res.body, body)
                        done();
                    })
            });
    })

})