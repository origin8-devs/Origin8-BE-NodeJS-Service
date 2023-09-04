const chai = require('chai');
const chaiHttp = require('chai-http');
const { baseURL, users, getParams } = require('../helpers');
const { testMap, validatorMap } = require('../constants');
const { Reviews } = require('./flow');
const should = chai.should();
chai.use(chaiHttp);
const routes = {
    login: 'users/login',
    getReviews: 'reviews/getAll/'
}
let { statusValidator, valueValidator, payloadTypeValidator, payloadValidator } = validatorMap;
let { getReviews } = Reviews;
describe('Flow - Fetching Reviews', () => {
    let Token = null;
    let userId = null;
    let reviewId = null;
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
            .get(routes.getReviews + userId)
            .set('Authorization', Token)
            .set('Provider', 'Cognito')
            .end((err, res) => {
                if (!res.body.reviews.length)
                    throw new Error('No Existing Reviews')
                reviewId = res.body.reviews[0].reviewId;
                done();
            });
    });

    getReviews.map((
        { should, status, body = {}, useToken = true, properties = [],
            route, ...rest }) => {

        describe((rest.method).toUpperCase() + " - " + rest.describe, () => {

            it(testMap[should],
                (done) => {
                    chai.request(baseURL)
                    [rest.method](route +
                        getParams(should, 'getReview', reviewId, userId))
                        .set('Authorization', useToken ? Token : null)
                        .set('Provider', 'Cognito')
                        .send(body)
                        .end((err, res) => {
                            if (err)
                                throw new Error(err.message)
                            statusValidator(res, status);
                            payloadTypeValidator(res, 'object');
                            if (rest.id < 5) {
                                //For Get Single Review
                                payloadValidator(res.body, body.reviewParent)
                                payloadValidator(res.body.reviewData, body.review)
                            }
                            if (rest.id >= 5 && res.body.reviews?.length) {
                                //For Get All Reviews
                                payloadValidator(res.body, body.reviewsParent)
                                payloadValidator(res.body.reviews[0], body.review)
                            }
                            if (properties.length)
                                valueValidator(res.body, properties)
                            done();
                        })
                });
        })
    })

})