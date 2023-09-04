const chai = require('chai');
const chaiHttp = require('chai-http');
const { property } = require('lodash');
const { baseURL, users, extractToken, addParams } = require('../helpers');
const { testMap, validatorMap } = require('../constants');
const { Plans } = require('./flow');
const should = chai.should();
chai.use(chaiHttp);
const routes = {
    login: 'users/login',
}
let { statusValidator, valueValidator } = validatorMap;
let { createPlan } = Plans;
describe('Flow - Creating a Plan', () => {
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

    createPlan.map((
        { should, status, body = {}, useToken = true, properties = [],
            route, ...rest }) => {

        describe((rest.method).toUpperCase() + " - " + rest.describe, () => {

            it(testMap[should],
                (done) => {
                    chai.request(baseURL)
                    [rest.method](route)
                        .set('Authorization', useToken ? Token : null)
                        .set('Provider', 'Cognito')
                        .send(body)
                        .end((err, res) => {
                            if (err)
                                throw new Error(err.message)
                            statusValidator(res, status);
                            if (properties.length)
                                valueValidator(res.body, properties)
                            done();
                        })
                });
        })
    })

})