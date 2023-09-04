const chai = require('chai');
const chaiHttp = require('chai-http');
const { baseURL, users, getParams } = require('../helpers');
const { testMap, validatorMap } = require('../constants');
const { Blogs } = require('./flow');
const should = chai.should();
chai.use(chaiHttp);
const routes = {
    login: 'users/login',
    getBlogs: 'blogs/get'
}
let { statusValidator, valueValidator, payloadTypeValidator, payloadValidator } = validatorMap;
let { getBlogs } = Blogs;
describe('Flow - Fetching Blogs', () => {
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
    before((done) => {
        chai.request(baseURL)
            .get(routes.getBlogs)
            .set('Authorization', Token)
            .set('Provider', 'Cognito')
            .send(users.valid)
            .end((err, res) => {
                if (!res.body.blogData.length)
                    throw new Error('No Existing blogs.')
                blogId = res.body.blogData[0].blogId
                done();
            });
    });

    getBlogs.map((
        { should, status, body = {}, useToken = true, properties = [],
            route, ...rest }) => {

        describe((rest.method).toUpperCase() + " - " + rest.describe, () => {

            it(testMap[should],
                (done) => {
                    chai.request(baseURL)
                    [rest.method](route
                        + getParams(should, 'getBlogByBlogId', blogId))
                        .set('Authorization', useToken ? Token : null)
                        .set('Provider', 'Cognito')
                        .send(body)
                        .end((err, res) => {
                            if (err)
                                throw new Error(err.message)
                            statusValidator(res, status);
                            payloadTypeValidator(res, 'object')
                            if (rest.id < 5)
                                payloadValidator(res.body.blogData, body.getBlog)
                            if (rest.id <= 7)
                                payloadValidator(res.body, body.getBlogById)
                            if (properties?.length)
                                valueValidator(res.body, properties)
                            if (rest.id == 5)
                                payloadValidator(res.body.blogData[0], body.getBlog)
                            if (rest.id == 7)
                                payloadValidator(res.body, body.allBlogs)
                            if (rest.id == 8)
                                payloadValidator(res.body.allBlogs[0], body.getBlog)

                            done();
                        })
                });
        })
    })

})