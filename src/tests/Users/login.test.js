process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const baseURL = 'localhost:4040/api';
const route = '/users/login';

const {
    Errors: { objects: ErrorsObjects }
} = require('../../imports');

const {
    Users: User 
} = require('../../imports/appData');


const { ErrorsFactory } = require('../../factories');
const { CognitoClient } = require('../../libraries');


let testUser  = {
    emailAddress : "mayaNo9100@gmail.com",
    password : "Password__123",
    name :"Abdullah K",
    phoneNumber : "+923333525193"
};

let failedUser  = {
    "emailAddress" : "impossible@gmail.com",
    "password" : "Ahmed@123"
};


chai.use(chaiHttp);

let Users = null;

describe('/POST user login', function() {

    before(async () => {
        try {
            // DB variables
            const sequelizeInstance = require('../../models/index');
            const config = { TEST_DB_HOST } = require('../../config');
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
            if (foundUser){
                let {
                    status
                } = foundUser;
                let updatedData = {};
                if (status == User.status.EMAIL_ADDED){
                    updatedData = {
                        status: User.status.PHONE_VERIFIED,
                        OTPused: true
                    };
                    await Users.update(updatedData, {
                        where: {
                          emailAddress: testUser.emailAddress
                        }
                    });
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
                    OTPused: true
                };
                await Users.update(updatedData, {
                    where: {
                     emailAddress: testUser.emailAddress
                    }
                });
                await CognitoClient.confirmUser({ "Username": testUser.emailAddress });
            }
        } catch (exc) {
            const { message } = exc;

            const { Error: { error } } = new ErrorsFactory({ message });
            console.log(error);
            console.log(exc);

        }   

    });

    it("it should return an object containing an accessToken", (done) => {


        chai.request(baseURL)
        .post(route)
        .send(testUser)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('accessToken');
            done();
        })
    });
    it("it should NOT allow a user with invalid credentials to login", async () => {

         // DB variables
         const sequelizeInstance = require('../../models/index');
         const { TEST_DB_HOST } = require('../../config');
 
         // DB set up
         if (TEST_DB_HOST) {
             await sequelizeInstance();
         }
 
 
        Users = global.db?.models.Users;
        
        const foundUser = await Users.findOne({
            where: {
                emailAddress: failedUser.emailAddress
            }
        });

        if (foundUser){
            await CognitoClient.deleteUser(failedUser.emailAddress);
            await Users.destroy({
                where: {
                    emailAddress: failedUser.emailAddress
                }
            })
        }

        const res = await chai.request(baseURL)
                            .post(route)
                            .send(failedUser)
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message', 'invalid_credentials');
    });
});