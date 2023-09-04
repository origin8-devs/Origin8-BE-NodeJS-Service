const {
    AppData: { Users }
  } = require('../../../imports');
const {
    TEST_DB_HOST
} = require('../../../config');

const { CognitoClient } = require('../../../libraries');

const tripHost = { 
    name: "Jennifer Ali", 
    emailAddress: "jennifer@gmail.com",
    phoneNumber: "+923811964558",
    password: 'Password__123',
    status: Users.status.PHONE_VERIFIED
};

const tripWisher =  { 
    name: "Fakhar Ali", 
    emailAddress: "fakhar@gmail.com",
    phoneNumber: "+923214936351",
    password: 'Password__123',
    status: Users.status.PHONE_VERIFIED
}

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

    let tripHostDocument = await findDocument('Users', {emailAddress: tripHost.emailAddress});
    const tripHostId = await checkAndGetUserId(tripHostDocument, tripHost, createDocument);    
    
    let tripWisherDocument = await findDocument('Users', {emailAddress: tripWisher.emailAddress});
    const tripWisherId = await checkAndGetUserId(tripWisherDocument, tripWisher, createDocument);


    const {tripId, tripName} =  await createDocument('Trips', { 
        tripName: "Trip 2", 
        tripType: "Public",
        note: "Keep your bags with you.",
        startDate: "2023-03-02T22:02:09.648068+00:00",
        endDate: "2023-03-07T22:02:09.648068+00:00",
        tripCost: 1000,
        description: "trip 2 description",
        numTravellers: 10,
        location: "Karachi, Pakistan",
        imageURLs: ["atif","data:junaid","data:akram"],
        isPublished: true
    });

    const {tripId: privateTripId} =  await createDocument('Trips', { 
        tripName: "Trip 3 Private", 
        tripType: "Private",
        note: "Keep your bags with you.",
        startDate: "2023-03-02T22:02:09.648068+00:00",
        endDate: "2023-03-07T22:02:09.648068+00:00",
        tripCost: 1000,
        description: "trip 3 Private description",
        numTravellers: 10,
        location: "Lahore, Pakistan",
        imageURLs: ["atif","data:junaid","data:akram"],
        isPublished: true
    });

    await createDocument('TripHistories', { userId: tripHostId, tripId });
    await createDocument('TripHistories', { userId: tripHostId, tripId: privateTripId });

    return {tripId, tripName, privateTripId};
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
    dbSetup, tripWisher
}