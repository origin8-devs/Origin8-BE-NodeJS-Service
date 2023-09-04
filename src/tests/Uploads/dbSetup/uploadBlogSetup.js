const {
    AppData: { Users }
  } = require('../../../imports');
const {
    TEST_DB_HOST
} = require('../../../config');

const { CognitoClient } = require('../../../libraries');

const user = { 
    name: "Abdul Rafay Jii", 
    emailAddress: "jii@gmail.com",
    phoneNumber: "+923851244558",
    password: 'Password__123',
    status: Users.status.PHONE_VERIFIED
};


const dbSetup =  async () => {

    // DB variables
    const sequelizeInstance = require('../../../models/index');

    // DB set up
    if (TEST_DB_HOST) {
        await sequelizeInstance();
    }

    const {
        createDocument, findDocument
    } = require('../../../modules/utils/queryFunctions');

    let userDocument = await findDocument('Users', {emailAddress: user.emailAddress});
    const userId = await checkAndGetUserId(userDocument, user, createDocument);

    const {blogId} = await createDocument('Communities', {
        imageURLs: ["data:image"],
        pdfURLs: ["urls"],
        name: "Fourth Blog",
        description: "A Great Blog",
        userId
    });
    return {blogId};
}

const checkAndGetUserId = async(document, userObject, createDocument) => {
    let returnedUserId = null;
    if (Array.isArray(document) == true && document.length == 0){
        const {
            userId
        } = await createDocument('Users', userObject);
        returnedUserId = userId;
        await CognitoClient.createUser(userObject.emailAddress, userObject.password);
        await CognitoClient.confirmUser({ "Username": userObject.emailAddress });
    }

    else if (typeof document == 'object' && Array.isArray(document) == false){
        returnedUserId = document.dataValues.userId;
    }
    return returnedUserId;
}

module.exports = {
    dbSetup, user
}