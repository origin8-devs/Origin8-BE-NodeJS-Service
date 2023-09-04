const {
    AppData: { Users }
  } = require('../../../imports');
const {
    TEST_DB_HOST
} = require('../../../config');

const { CognitoClient } = require('../../../libraries');

const user = { 
    name: "Noorudin Jii", 
    emailAddress: "noorudin@gmail.com",
    phoneNumber: "+923877244558",
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

    const {tripId} =  await createDocument('Trips', { 
        tripName: "Trip for uploading DAY image", 
        tripType: "Public",
        note: "Keep your bags with you.",
        startDate: "2023-03-02T22:02:09.648068+00:00",
        endDate: "2023-03-07T22:02:09.648068+00:00",
        tripCost: 1000,
        description: "trip for uploading DAY image description",
        numTravellers: 10,
        location: "Karachi, Pakistan",
        imageURLs: ["atif","data:junaid","data:akram"],
        isPublished: true
    });

    await createDocument('TripHistories', { userId, tripId });

    const { dayId } = await createDocument('Days', {
        description: "Mazay karengay full",
        imageURLs: ["urls"],
        dayNumber: 1,
        tripId
    })
    return {dayId};
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