process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const baseURL = 'localhost:4040/api';
const route = '/explore/addToWishlist'
const { CognitoClient } = require('../../libraries');   
const {
    Errors: { objects: ErrorsObjects }
} = require('../../imports');

const { SEED } = require('../../config');
const isSeedMode = JSON.parse(SEED || false);

const {
    Users: User 
} = require('../../imports/appData');

const {
    dbSetup,
    tripWisher
} = require('./dbSetup/postWishSetup');

chai.use(chaiHttp);



describe('/POST Wishlist', function () {

    let returnedtripId = null;
    let returnedtripName = null;
    let returnedPrivateTripId = null;
    let accessToken = null;
    before(async () => {
        const {
            tripId,
            tripName,
            privateTripId
        } = await dbSetup();
        returnedtripId = tripId;
        returnedtripName = tripName;
        returnedPrivateTripId = privateTripId;
        accessToken = await CognitoClient.Login({
            name: tripWisher.emailAddress,
            password: tripWisher.password
        });
    });  
     
    it("It should return an object containing a success message after adding a trip to the wishlist", (done) => {

        const object = {
            tripId: returnedtripId 
        } 
        chai.request(baseURL)
        .post(route)
        .send(object)
        .set('Authorization', accessToken)
        .set('Provider', 'Cognito')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object')
                .that.deep.includes({
                    success: true,
                    message: returnedtripName+" has been added to the user's wishlist"
                })
                done();
        })
    });

    it("It should return an error when adding a trip that is already present in the user's wishlist ", (done) => {

        const object = {
            tripId: returnedtripId 
        } 
        chai.request(baseURL)
        .post(route)
        .send(object)
        .set('Authorization', accessToken)
        .set('Provider', 'Cognito')
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object')
                .that.deep.includes({
                    message: "The trip specified has already been added to the wishlist"
                })
                done();
        })

    });

    it("It should return an error when adding a trip that is private ", (done) => {

        const object = {
            tripId: returnedPrivateTripId 
        } 
        chai.request(baseURL)
        .post(route)
        .send(object)
        .set('Authorization', accessToken)
        .set('Provider', 'Cognito')
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object')
                .that.deep.includes({
                    message: "You can't add private trips to your Wishlist"
                })
                done();
        })

    });
});