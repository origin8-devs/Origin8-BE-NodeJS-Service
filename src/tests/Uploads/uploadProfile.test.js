process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const baseURL = 'localhost:4040/api';
const route = '/uploads/uploadProfile'
const { CognitoClient } = require('../../libraries');  
const fs = require("fs"); 
const {
    Errors: { objects: ErrorsObjects }
} = require('../../imports');

const { SEED } = require('../../config');
const isSeedMode = JSON.parse(SEED || false);

const {
    dbSetup,
    user
} = require('./dbSetup/uploadProfileSetup');

chai.use(chaiHttp);



describe('/POST Upload Profile', function () {

    let accessToken = null;
    before(async () => {

        await dbSetup();
        
        accessToken = await CognitoClient.Login({
            name: user.emailAddress,
            password: user.password
        });
    });  
     
    it("It should return a success response containing details about the location of the image stored", (done) => {

        chai.request(baseURL)
            .post(route)
            .set('content-type', 'application/x-www-form-urlencoded')
            .attach('images', fs.readFileSync(`${__dirname}\\dbSetup\\profilepic.jpg`), 'Uploads/dbSetup/profilepic.jpg')
            .set('Authorization', accessToken)
            .set('Provider', 'Cognito')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.should.have.lengthOf(1)
                res.body[0].should.be.a('object')
                    .that.include.all.keys('Location','Key','ETag')
                    done();
            })
    });

    it("It should return an error message if the request does not contain any images", (done) => {
        chai.request(baseURL)
            .post(route)
            .set('Authorization', accessToken)
            .set('Provider', 'Cognito')
            .end((err, res) => {
                res.should.have.status(411);
                res.body.should.be.a('object')
                    .that.deep.includes({
                        message: "validation_error"
                    })
                done();
            })
    });

});