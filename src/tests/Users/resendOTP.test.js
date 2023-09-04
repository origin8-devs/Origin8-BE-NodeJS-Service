process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const baseURL = 'localhost:4040/api';
const route = '/users/resend/otp';
const { CognitoClient, signAndReturnJWT, Common } = require('../../libraries');
const {
    roles, 
    Users: User
} = require('../../imports/appData');

const {
    Errors: { objects: ErrorsObjects }
} = require('../../imports');


const { ErrorsFactory } = require('../../factories');

let testUser  = {
    emailAddress : "testing10@gmail.com",
    password : "Password__123",
    name :"Iftikhar Chaudry",
    phoneNumber : "+923321020993"
};

chai.use(chaiHttp);

let Users = null;

describe('/POST verify OTP', function() {

    let accessToken = null;
    let OTP = null;
    before(async () => {
        try {
            // DB variables
            const sequelizeInstance = require('../../models/index');
            const { TEST_DB_HOST } = require('../../config');

            // DB set up
            if (TEST_DB_HOST) {
                await sequelizeInstance();
            }

            //done after DB is set up so that db is set to global and can be accessed within users.service
            const { createUser } = require('../../modules/users/users.service');

            Users = global.db?.models.Users;

            const foundUser = await Users.findOne({
                where: {
                    emailAddress: testUser.emailAddress
                }
            });
            if (foundUser){
                let {
                    status
                } = foundUser;
                let updatedData = {};
                if (status == User.status.PHONE_VERIFIED){
                    await CognitoClient.deleteUser(testUser.emailAddress);
                    updatedData = {
                        status: User.status.EMAIL_ADDED,
                    }; 
                    await CognitoClient.createUser(testUser.emailAddress, testUser.password);
                }
            
                updatedData.OTP = Common.random(6);
                updatedData.OTPExpiration = new Date(new Date().getTime() + 5 * 60000);
                updatedData.OTPused = false;

                await Users.update(updatedData, {
                    where: {
                      emailAddress: testUser.emailAddress
                    }
                });

                const userDocument = await Users.findOne({
                    where: {
                        emailAddress: testUser.emailAddress
                    }
                });

                accessToken = signAndReturnJWT({
                    ...userDocument.dataValues
                });
                OTP = updatedData.OTP;
            }
            else {
                let req = {};
                req.body = {
                    emailAddress: testUser.emailAddress,
                    password: testUser.password,
                    name: testUser.name,
                    phoneNumber: testUser.phoneNumber
                };
                let { accessToken: accessTokenReturned, userDocument } = await createUser(req);
                
                OTP = userDocument.OTP;
                accessToken = accessTokenReturned;
            }
        } catch (exc) {
            const { message } = exc;

            const { Error: { error } } = new ErrorsFactory({ message });
            console.log(error);
            console.log(exc);

        }  
    });

    it("it should return an object containing foundUser after sending the correct OTP", (done) => {

        chai.request(baseURL)
        .put(route)
        .set('Authorization', accessToken)
        .set('Provider', 'Cognito')
        .end((err, res) => {
            res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('accessToken');
                res.body.should.have.property('foundUser')
                    .that.is.an('object')
                    .that.include.all.keys('userId','OTP','OTPused', 'password', 'status', 'type', 'planSubscribed', 'profilePicURL', 'provider','idCardURL', 'bio', 'firebaseToken', 'isVerified', 'jwtToken', 'OTPExpiration', 'userStripeId', 'subscriptionId', 'defaultCardId', 'location', 'createdAt', 'updatedAt', 'emailAddress', 'name','phoneNumber' )
                    .that.deep.includes({
                        emailAddress: testUser.emailAddress,
                        name: testUser.name,
                        phoneNumber: testUser.phoneNumber
                    })
                done();
        });
    });

    it("it should return an 'InvalidToken' message if a user that has been already verified or a user with a malformed token tries to hit the endpoint", (done) => {

        chai.request(baseURL)
        .put(route)
        .set('Authorization', accessToken+'s')
        .set('Provider', 'Cognito')
        .end((err, res) => {
            res.should.have.status(403);
                res.body.should.be.a('object')
                res.body.should.have.property('message', 'InvalidToken')
                done();
        })
    });

});