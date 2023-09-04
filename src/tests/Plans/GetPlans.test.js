const chai = require('chai');
const chaiHttp = require('chai-http');
const { property } = require('lodash');
const { baseURL, users, extractToken, addParams, planQuery } = require('../helpers');
const { testMap, validatorMap } = require('../constants');
const { Plans } = require('./flow');
const should = chai.should();
chai.use(chaiHttp);
const routes = {
    login: 'users/login',
    getAllPlans: 'plans/allPlans'
}
let { statusValidator, payloadValidator, payloadTypeValidator } = validatorMap;
let { getPlans } = Plans;
describe('Flow - Fetching Plans', () => {
    let Token = null;
    let userId = null;
    let planName = null;
    before((done) => {
        chai.request(baseURL)
            .post(routes.login)
            .send(users.valid)
            .end((err, res) => {
                Token = res.body.accessToken;
                userId = res?.body?.user?.userId;
                done();
            });
    });
    before((done) => {
        chai.request(baseURL)
            .get(routes.getAllPlans)
            .set('Authorization', Token)
            .set('Provider', 'Cognito')
            .end((err, res) => {
                if (typeof res.body.plans == 'object')
                    planName = res.body.plans.name;
                if (typeof res.body.plans == 'array')
                    planName = res.body.plans[0].name;
                done();
            });
    });

    getPlans.map((
        { should, status, body = {}, useToken = true, properties = [],
            route, ...rest }) => {

        describe((rest.method).toUpperCase() + " - " + rest.describe, () => {

            it(testMap[should],
                (done) => {
                    chai.request(baseURL)
                    [rest.method](route)
                        .set('Authorization', useToken ? Token : null)
                        .set('Provider', 'Cognito')
                        .query({
                            name: planQuery(should, planName)
                        })
                        .send(body)
                        .end((err, res) => {
                            if (err)
                                throw new Error(err)
                            payloadTypeValidator(res, 'object')
                            payloadValidator(res.body.metaData, body.metaData)
                            if (typeof res.body.plans == 'array')
                                payloadValidator(res.body.plans[0], body.plan)
                            if (typeof res.body.plans == 'object')
                                payloadValidator(res.body.plans, body.plan)
                            statusValidator(res, status);
                            done();
                        })
                });
        })
    })

})