process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const baseURL = 'localhost:4040/api';
const route = '/explore/createBooking'
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
    tripBooker
} = require('./dbSetup/createBookingSetup');

chai.use(chaiHttp);



describe('/POST Book a Trip', function () {

    let returnedTripId = null;
    let returnedTripName = null;
    let returnedTripId2 = null;
    let returnedTripName2 = null;
    let returnedSlotsRemaining2 = null;
    let accessToken = null;
    before(async () => {
        const {
            tripId,
            tripName,
            tripId2,
            tripName2,
            slotsRemaining2
        } = await dbSetup();
        returnedTripId = tripId;
        returnedTripName = tripName;
        returnedTripId2 = tripId2;
        returnedTripName2 = tripName2;
        returnedSlotsRemaining2 = slotsRemaining2;

        accessToken = await CognitoClient.Login({
            name: tripBooker.emailAddress,
            password: tripBooker.password
        });
    });  
     
    it("It should return an object containing a success message after making a booking", (done) => {

        const object = {
            tripId: returnedTripId,
            slots: 4  
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
                    message: "Booking for "+ returnedTripName
                })
                done();
        })
    });

    it("It should not allow the user to make the same booking again", (done) => {

        const object = {
            tripId: returnedTripId,
            slots: 4  
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
                    message: "Booking has already been made"
                })
                done();
        })
    });

    it("It should not allow the user to book more slots than are available", (done) => {

        const object = {
            tripId: returnedTripId2,
            slots: returnedSlotsRemaining2+5
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
                    message: "There aren't enough slots remaining"
                })
                done();
        })
    });
});