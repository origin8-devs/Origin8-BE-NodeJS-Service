const {
    AppData: { Users }
  } = require('../../../imports');
const {
    TEST_DB_HOST
} = require('../../../config');

const { CognitoClient } = require('../../../libraries');

const tripHost = { 
    name: "Jennifer Durrani", 
    emailAddress: "durrani@gmail.com",
    phoneNumber: "+923854864558",
    password: 'Password__123',
    status: Users.status.PHONE_VERIFIED
};

const tripBooker =  { 
    name: "Sahab Hassan", 
    emailAddress: "hassan@gmail.com",
    phoneNumber: "+923214194352",
    password: 'Password__123',
    status: Users.status.PHONE_VERIFIED
}

// this card is made for testing and provided by Stripe
const cardDetails = {
    cardNumber: 4000056655665556,
    expMonth: 3,
    expYear: 34,
    cvc: 4334,
    cardHolder: "Ahmed Malik",
    cardType: "Visa"
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

    const {
        createNewStripeUser, 
        createNewStripeCard 
    } = require('../../../libraries/stripe');

    let tripHostDocument = await findDocument('Users', {emailAddress: tripHost.emailAddress});
    const tripHostId = await checkAndGetUserId(tripHostDocument, tripHost, createDocument);    
    
    let tripBookerDocument = await findDocument('Users', {emailAddress: tripBooker.emailAddress});
    const tripBookerId = await checkAndGetUserId(tripBookerDocument, tripBooker, createDocument);

    let { name, emailAddress, userStripeId: userStripeIdToUse } = await findDocument('Users', { userId: tripBookerId }, 'check')
        //If Stripe User is not already created.
        if (!userStripeIdToUse)
            userStripeIdToUse = await createNewStripeUser(tripBookerId, name, emailAddress)
        //Creating a card
        await createNewStripeCard({ ...cardDetails, userStripeIdToUse, userId: tripBookerId });
    
    const {tripId, tripName} =  await createDocument('Trips', { 
        tripName: "Trip 2", 
        tripType: "Private",
        note: "Keep your bags with you.",
        startDate: "2023-03-02T22:02:09.648068+00:00",
        endDate: "2023-03-07T22:02:09.648068+00:00",
        tripCost: 1000,
        description: "trip 2 description",
        numTravellers: 10,
        location: "Karachi, Pakistan",
        tripName: "Trip 2",
        imageURLs: ["atif","data:junaid","data:akram"],
        isPublished: true,
        slotsRemaining: 10
    });

    const {tripId: tripId2, tripName: tripName2, slotsRemaining : slotsRemaining2} =  await createDocument('Trips', { 
        tripName: "Trip 3", 
        tripType: "Private",
        note: "Keep your bags with you.",
        startDate: "2023-03-02T22:02:09.648068+00:00",
        endDate: "2023-03-07T22:02:09.648068+00:00",
        tripCost: 2000,
        description: "trip 3 description",
        numTravellers: 10,
        location: "Karachi, Pakistan",
        tripName: "Trip 2",
        imageURLs: ["atif","data:junaid","data:akram"],
        isPublished: true,
        slotsRemaining: 10
    });

    await createDocument('TripHistories', { userId: tripHostId, tripId });
    await createDocument('TripHistories', { userId: tripHostId, tripId: tripId2 });


    return {tripId, tripName, tripId2, tripName2, slotsRemaining2};
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
    dbSetup, tripBooker
}