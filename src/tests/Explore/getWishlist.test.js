process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const baseURL = 'localhost:4040/api';
const route = '/explore/getWishList'
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
} = require('./dbSetup/getWishSetup');

chai.use(chaiHttp);



describe('/GET Wishlists', function () {

    
    let accessToken = null;
    before(async () => {

        await dbSetup();
        accessToken = await CognitoClient.Login({
            name: tripWisher.emailAddress,
            password: tripWisher.password
        });
   
    });   
    it("It should return either an object containing one wishlist item or an array of wishlist items", (done) => {

        chai.request(baseURL)
        .get(route)
        .set('Authorization', accessToken)
        .set('Provider', 'Cognito')
        .end((err, res) => {
            res.should.have.status(200);
            if (Array.isArray(res.body)){
                res.body.should.be.a('array');
                for (let i=0;i<res.body.length;i++){
                    res.body[i].should.be.a('object')
                        .that.include.all.keys('listId', 'createdAt', 'updatedAt', 'userId', 'tripId')
                }
                
            }
            else if (typeof res.body === 'object'){
                res.body.should.be.a('object');
                res.body.should.have.keys('listId', 'createdAt', 'updatedAt', 'userId', 'tripId')
            }
            done();
        })

    });
});