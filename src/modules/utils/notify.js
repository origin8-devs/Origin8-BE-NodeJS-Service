const {
    AppData: { Notifications }
  } = require('../../imports');
const { createDocument} = require('./queryFunctions');


const admin = require("../../libraries/firebase");

const sendNotification = async(title, notificationObject, tokens = [],  ) => {

    const {
        text: body,
        type,
        senderId,
        toUsers
    } = notificationObject;

    await createDocument('Notifications', notificationObject);
    await admin.messaging().sendMulticast({
        notification: { title: title, body: body },
        data: {
            type: type,
            senderId,
            toUsers
        },
        tokens: tokens,
        mutableContent: true
    });
};
    
