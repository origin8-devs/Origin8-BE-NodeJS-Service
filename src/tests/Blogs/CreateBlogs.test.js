const chai = require('chai');
const chaiHttp = require('chai-http');
const { baseURL, users, getParams } = require('../helpers');
const { testMap, validatorMap } = require('../constants');
const { Blogs } = require('./flow');
const should = chai.should();
chai.use(chaiHttp);
const routes = {
    login: 'users/login',
}
let { statusValidator, valueValidator, payloadTypeValidator } = validatorMap;
let { createBlogs } = Blogs;
describe('Flow - Posting / Updating a Blog', () => {
    let Token = null;
    let userId = null;
    let blogId = null;
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


    createBlogs.map((
        { should, status, body = {}, useToken = true, properties = [],
            route, ...rest }) => {

        describe((rest.method).toUpperCase() + " - " + rest.describe, () => {

            it(testMap[should],
                (done) => {
                    chai.request(baseURL)
                    [rest.method](route + getParams(rest.method, 'put', blogId))
                        .set('Authorization', useToken ? Token : null)
                        .set('Provider', 'Cognito')
                        .send(body)
                        .end((err, res) => {
                            if (rest.id == 1)
                                blogId = res.body.blog.blogId
                            if (err)
                                throw new Error(err.message)
                            if (should == 'postReview')
                                reviewId = res.body.review.reviewId
                            statusValidator(res, status);
                            payloadTypeValidator(res, 'object');
                            if (properties.length)
                                valueValidator(res.body, properties)
                            done();
                        })
                });
        })
    })

})