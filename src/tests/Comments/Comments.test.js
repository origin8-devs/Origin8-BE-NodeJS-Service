const chai = require('chai');
const chaiHttp = require('chai-http');
const { baseURL, users, getParams } = require('../helpers');
const { testMap, validatorMap } = require('../constants');
const { Comments } = require('./flow');
const should = chai.should();
chai.use(chaiHttp);
const routes = {
    login: 'users/login',
    getComments: 'blogs/comment/get/1'
}
let { statusValidator, valueValidator, payloadTypeValidator, payloadValidator } = validatorMap;
let { postComments } = Comments;
describe('Flow - Comments', () => {
    let Token = null;
    let userId = null;
    let commentId = null;
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
            .get(routes.getComments)
            .set('Authorization', Token)
            .set('Provider', 'Cognito')
            .end((err, res) => {
                if (!res.body.comments?.length)
                    throw new Error('No Comments Exist!')
                commentId = res.body.comments[0].id;
                done();
            });
    });
    postComments.map((
        { should, status, body = {}, useToken = true, properties = [],
            route, ...rest }) => {

        describe("Test #" + `${rest.id} | ` + (rest.method).toUpperCase() + " - " + rest.describe, () => {

            it(testMap[should],
                (done) => {
                    chai.request(baseURL)
                    [rest.method](route +
                        getParams(rest.method, 'put', commentId) +
                        getParams(rest.method, 'delete', commentId))
                        .set('Authorization', useToken ? Token : null)
                        .set('Provider', 'Cognito')
                        .send(body)
                        .end((err, res) => {
                            if (err)
                                throw new Error(err.message)
                            statusValidator(res, status);
                            payloadTypeValidator(res, 'object');
                            //Validation checks For Get Endpoints
                            if (should == 'getComments') {
                                payloadValidator(res.body.metaData, body.metaData)
                                payloadValidator(res.body.comments[0], body.comment)
                            }
                            if (properties.length)
                                valueValidator(res.body, properties)
                            done();
                        })
                });
        })
    })
})