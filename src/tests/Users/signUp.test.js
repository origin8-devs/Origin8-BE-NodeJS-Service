process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const baseURL = 'localhost:4040/api';
const signUpRoute = '/users/signup'
const { CognitoClient } = require('../../libraries');   
const {
    Errors: { objects: ErrorsObjects }
} = require('../../imports');

const {
    Users: User 
} = require('../../imports/appData');

chai.use(chaiHttp);

//variables for tests

let testUser  = {
    emailAddress : "mayaTheTwo@gmail.com",
    password : "Password__123",
    name :"Iftikhar Chaudhry",
    phoneNumber : "+923321520993"
};
testUser.emailAddress = testUser.emailAddress.trim().toLowerCase();

let Users = null;

describe('/POST User signUp', function () {

    
    before(async () => {

        // DB variables
        const sequelizeInstance = require('../../models/index');
        const { TEST_DB_HOST } = require('../../config');

        // DB set up
        if (TEST_DB_HOST) {
            await sequelizeInstance();
        }

        Users = global.db?.models.Users;

        let foundUser = await Users.findAll({
            where: {
                emailAddress: testUser.emailAddress
            }
        });
        if (foundUser.length > 0) {
            await CognitoClient.deleteUser(testUser.emailAddress);
            await Users.destroy({
                where: {
                    emailAddress: testUser.emailAddress
                }
            })
        }
    });

    it("It should return an object containing an accessToken and a user document containing the OTP", (done) => {

        chai.request(baseURL)
            .post(signUpRoute)
            .send(testUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('accessToken');
                res.body.should.have.property('userDocument')
                    .that.is.an('object')
                    .that.include.all.keys('userId','OTP','OTPused', 'password', 'status', 'type', 'planSubscribed', 'profilePicURL', 'provider','idCardURL', 'bio', 'firebaseToken', 'isVerified', 'jwtToken', 'OTPExpiration', 'userStripeId', 'subscriptionId', 'defaultCardId', 'location', 'createdAt', 'updatedAt', 'emailAddress', 'name','phoneNumber')
                    .that.deep.includes({
                        emailAddress: testUser.emailAddress,
                        name: testUser.name,
                        phoneNumber: testUser.phoneNumber
                    })
                done();
            });
    });
    it("It should return an error message if a verified user tries to signup again with the same credentials", async () => {

        // DB variables
        const sequelizeInstance = require('../../models/index');
        const { TEST_DB_HOST } = require('../../config');

        // DB set up
        if (TEST_DB_HOST) {
            await sequelizeInstance();
        }

        const { createUser } = require('../../modules/users/users.service');

        Users = global.db?.models.Users;

        const foundUser = await Users.findOne({
            where: {
                emailAddress: testUser.emailAddress
            }
        });

        let updatedData = {};
        if (foundUser) {
            let {
                status
            } = foundUser;
            if (status == User.status.EMAIL_ADDED){
                updatedData = {
                    status: User.status.PHONE_VERIFIED,
                };
                
                await Users.update(updatedData, {
                    where: {
                      emailAddress: testUser.emailAddress
                    }
                });
                await CognitoClient.confirmUser({ "Username": testUser.emailAddress });
            }
        } else {
            let req = {};
                req.body = {
                    emailAddress: testUser.emailAddress,
                    password: testUser.password,
                    name: testUser.name,
                    phoneNumber: testUser.phoneNumber
                };
            await createUser(req);

            updatedData = {
                status: User.status.PHONE_VERIFIED,
            };
            await Users.update(updatedData, {
                where: {
                  emailAddress: testUser.emailAddress
                }
            });
            await CognitoClient.confirmUser({ "Username": testUser.emailAddress });

        }
        const res = await chai.request(baseURL)
                            .post(signUpRoute)
                            .send(testUser)
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message','already_exist');
    });
});