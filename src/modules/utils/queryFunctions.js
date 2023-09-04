/** Third party dependencies*/
const _ = require('lodash');
const moment = require('moment')
const bcrypt = require('bcrypt');
const { model } = require('mongoose');
const Sequelize = require('sequelize');
const { searchCols } = require('../../tests/helpers');
var admin = require("./../../libraries/firebase");
const { messaging } = require('firebase-admin');
const { twillioClient, twillioSid } = require('../../libraries/twilio');
const { Op } = require("sequelize");
const appData = require('../../imports/appData');
const nodemailer = require("nodemailer")
const {
    EMAIL,
    PASSWORD
} = require('../../config');

let models = global.db?.models;
let sequelize = global.db;

const findDocument = async (modelName, query = {}, type = 'get', metaData = {}) => {
    let { limit = 5, offset = 0 } = metaData;
    let { attributes, raw = false, errorMessage = null } = query;
    if (attributes)
        delete query.attributes
    if (errorMessage)
        delete query.errorMessage
    delete query.raw
    let doc = await models[modelName].findAll({
        where: query,
        attributes,
        limit, offset, raw
    });
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound', { cause: { model: modelName, errorMessage } })
    if (!doc.length && type == 'get' && typeof doc == 'array')
        return []
    if (doc.length > 1)
        return doc
    return doc[0]
}

const findDocumentWithAttributes = async (modelName, query = {}, type = 'get', attributesArray = []) => {
    let doc = await models[modelName].findAll({
        attributes: attributesArray,
        where: query
    });
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    if (doc.length > 1)
        return doc
    return doc[0]
}

const findDocumentWithPagination = async (modelName, query = {}, type = 'get', pageN, pageS) => {
    let pageSize = pageS;
    let pageNumber = pageN;

    if (pageSize == null || pageNumber == null) {
        pageSize = null;
        pageNumber = null;
    }
    else {
        pageNumber = pageNumber - 1;
    }

    let doc = await models[modelName].findAll({
        where: query,
        limit: pageSize,
        offset: pageNumber * pageSize
    });
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    if (doc.length > 1)
        return doc
    return doc[0]
}

const findByJoin = async (payload, type = 'get') => {
    let {
        innerModel,
        outerModel,
        innerQuery = {},
        outerQuery = {},
        innerAs = null,
        metaData = {},
        outerAttributes = null,
        innerAttributes = null
    } = payload;
    let { limit = 5, offset = 0 } = metaData;
    let doc = await models[outerModel].findAll(
        {
            include: [{
                model: models[innerModel],
                as: innerAs,
                where: innerQuery,
                attributes: innerAttributes
            }],
            where: outerQuery,
            attributes: outerAttributes,
            limit, offset
        })

    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    return doc
}

const findByJoins = async (payload, type = 'get') => {
    let {
        innerModels = [],
        outerModel,
        outerQuery = {},
        metaData = {},
        outerAttributes = null,
        group = null, order = null, raw = false
    } = payload;
    let { limit = 5, offset = 0 } = metaData;
    let doc = await models[outerModel].findAll(
        {
            include: innerModels,
            where: outerQuery,
            attributes: outerAttributes,
            limit, offset, raw, order
        })

    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    return doc
}

const searchByQuery = async (payload, type = 'get') => {

    let {
        query,
        metaData,
        modelName,
        innerModels,
        outerQuery = {},
    } = payload;
    let { limit = 5, offset = 0 } = metaData;
    let Op = Sequelize.Op;
    let cols = searchCols[modelName]?.map((col) => ({ [col]: sequelize.where(sequelize.fn('LOWER', sequelize.col(col)), 'LIKE', '%' + (query).toLowerCase() + '%') }))
    let doc = await models[modelName].findAll({
        where: {
            [Op.or]: cols,
            ...outerQuery
        },
        include: innerModels,
        limit, offset
    })
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    return doc
}


const findByJoinManyToMany = async (payload, type = 'get') => {
    let { innerModel,
        outerModel,
        innerQuery = {},
        outerQuery = {},
        //these have been set to null as providing an empty array would actually affect the output
        outerAttributes = null,
        innerAttributes = null,
        junctionAttributes = null
    } = payload;
    let doc = await models[outerModel].findAll({
        attributes: outerAttributes,
        include: [{
            model: models[innerModel],
            innerQuery,
            attributes: innerAttributes,
            through: {
                attributes: junctionAttributes,
            }
        }],
        where: outerQuery
    });
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    return doc;
}

const updateDocument = async (modelName, payload, query = {}) => {
    let { transaction = null } = payload;
    delete payload.transaction;
    let doc = await models[modelName].update(
        payload,
        { where: query }, { transaction })
    if (!doc)
        throw new Error('ErrorUpdating')
    return doc
}

const createDocument = async (modelName, payload = {}) => {
    let { transaction = null } = payload;
    delete payload.transaction;
    let doc = await models[modelName].create(payload, { transaction })
    if (!doc)
        throw new Error('ErrorCreating')
    return doc
}

const softDelete = async (modelName, query = {}) => {
    let { transaction = null } = query;
    delete query.transaction;
    let doc = await models[modelName].update(
        { isDeleted: true },
        {
            where: query
        }, { transaction })
    return doc
}

const stringToArray = (stringToConvert) => {
    let data = stringToConvert.substr(1, stringToConvert.length - 2)
    data = data.split(',')
    let images = data.map(item => (
        item.substr(1, item.length - 2)
    ));
    // if (!images.length > 1)
    //     return []
    return images
}

const hardDelete = async (modelName, query = {}) => {
    let { transaction = null } = query;
    delete query?.transaction;
    let doc = await models[modelName].destroy({
        where: query
    }, { transaction });
    return doc;
}

const sendBulkNotification = async (message = {}) => {
    getMessaging().sendMulticast(message)
        .then((response) => {
            console.log(response.successCount + ' messages were sent successfully');
        });
}

const createNotification = async (params) => {

    let { text, type, senderId, adminId, receiverId, senderName, receiverName, tripId, blogId, transaction = null } = params;
    let notification = { text, type, senderId, adminId, senderName, receiverName }
    delete params.transaction;
    let doc;
    let { id: notificationId } = await models['Notifications'].create(notification, { transaction })
    if (Array.isArray(receiverId)) {
        let tokens = [];
        let arr = receiverId?.map(({ name, id, userId }) => {
            tokens.push(id)
            return {
                text,
                type,
                receiverId: id || userId,
                senderName,
                receiverName: name,
                notificationId,
                tripId,
                blogId
            }
        })
        doc = await models['NotificationHistory'].bulkCreate(arr, { transaction })
        await firebaseNotifications.bulk(tokens, { type, text, senderName, senderId: senderId || adminId, notificationId, tripId, blogId })
    }
    if (!Array.isArray(receiverId)) {
        doc = await models['NotificationHistory'].create({ blogId, text, type, receiverId, senderName, receiverName, notificationId, tripId }, { transaction })
        await firebaseNotifications.single({ tripId, text, type, senderId: senderId || adminId, receiverId, senderName, receiverName, notificationId, blogId })
    }
    if (!notificationId || !doc)
        throw new Error('ErrorCreating')
    return doc

}

const createAdminNotification = async (params) => {

    let { text, type, senderId, senderName, receiverName, tripId = null, blogId = null } = params;
    let { id } = await createDocument('AdminNotifications', { text, type, senderId, senderName, receiverName, tripId, blogId })
    await firebaseNotifications.admins({
        text,
        type,
        senderId,
        senderName,
        notificationId: id,
        tripId: tripId || "N/A", blogId: blogId || "N/A"
    })
    console.log({ text, type, senderId, senderName, notificationId: id })
}

const countRecords = async (modelName, condition) => {
    let query = condition ? condition : {}
    let doc = await models[modelName].count({
        where: query
    })
    return doc
}

const firebaseNotifications = {
    bulk: async (receivers = [], payload) => {
        let { type, text, senderName, senderId, notificationId, tripId = null, blogId = null } = payload;
        let foundSessions = await models.UserSessions.findAll({
            where: { userId: { [Sequelize.Op.in]: receivers } },
            attributes: ['firebaseToken']
        })
        let tokens = []
        foundSessions?.forEach(({ dataValues }) => {
            if (checkFirebaseToken(dataValues?.firebaseToken))
                tokens.push(dataValues?.firebaseToken)
        })
        let data = {
            type: (type)?.toString(),
            senderName: senderName || "",
            notificationId: (notificationId)?.toString(),
            senderId: (senderId)?.toString(),
            tripId: (tripId)?.toString() || "",
            blogId: (blogId)?.toString() || "",
        }
        console.log("Bulk: ", data, receivers)
        if (tokens?.length)
            await messaging().sendMulticast({
                notification: { title: appData.Notifications.headings[type] || 'Notification', body: text },
                data,
                tokens: tokens,
                mutableContent: true
            })
    },
    single: async (payload) => {
        let { text, type, receiverId, senderName, receiverName, notificationId, senderId, tripId = null, blogId = null } = payload;
        let session = await findDocument('UserSessions', { userId: receiverId, raw: true })
        let data = {
            type: (type)?.toString(),
            senderName: senderName,
            receiverName: receiverName || "",
            notificationId: notificationId ? (notificationId)?.toString() : "",
            senderId: senderId ? (senderId)?.toString() : "",
            tripId: tripId ? (tripId)?.toString() : "",
            blogId: blogId ? (blogId)?.toString() : ""
        }
        console.log("Single: ", data)
        if (session?.firebaseToken)
            await messaging().sendMulticast({
                notification: { title: appData.Notifications.headings[type] || 'Notification', body: text },
                data,
                tokens: [session?.firebaseToken],
                mutableContent: true
            })
    },
    admins: async (payload) => {
        let { type, text, senderName, senderId = null, notificationId = null } = payload;
        let foundSessions = await models.AdminSessions.findAll({
            attributes: ['firebaseToken'],
            where: {
                firebaseToken: { [Op.ne]: null }
            }
        })
        let tokens = []
        // check if firebase token not null
        if (foundSessions?.length)
            foundSessions?.forEach(({ dataValues }) => {
                if (checkFirebaseToken(dataValues?.firebaseToken))
                    tokens.push(dataValues?.firebaseToken)
            })

        if (tokens?.length)
            await messaging().sendMulticast({
                notification: { title: appData.AdminNotifications.headings[type] || 'Notification', body: text },
                data: {
                    type: (type)?.toString(),
                    senderName: senderName || "",
                    notificationId: notificationId ? (notificationId)?.toString() : "",
                    senderId: senderId ? (senderId)?.toString() : "",
                },
                tokens: tokens,
                mutableContent: true
            })

    },
}

const checkFirebaseToken = (value) => {
    if (!value) return false
    if (value === '') return false
    if (value === undefined) return false
    if (value === 'undefined') return false
    return true
}

const emailOTP = async ({ emailAddress, otp, name = "User" }) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: PASSWORD
        },
    });
    const mailOptions = {
        from: { address: EMAIL, name: 'Roam-Trips' },
        to: emailAddress,
        subject: "Roam-Trips One Time Password",
        text: `Hi ${name},\n\nWelcome to Roam Trips! To complete your signup process, please verify your phone number by entering the following verification code in the app: ${otp}.\nIf you did not initiate this signup process, please ignore this message.\n\nThank you,\n\nTeam Roam Trips.`
    };
    await transporter.sendMail(mailOptions)

}

const sendEmail = async (emailAddress, body, type = 'warn') => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: PASSWORD
        },
    });
    let { name } = await findDocument('Users', { emailAddress })
    let mailMeta = {
        warn: {
            subject: 'Warning!',
            body: `Hi ${name},\n\n${body}\n\nThank you,\n\nTeam Roam Trips.`
        },
        block: {
            subject: 'Account Blocked!',
            body: `Dear ${name},\n\n${body}.\n\nBest regards,,\n\nAdmin Roam Trips.`
        }
    }
    const mailOptions = {
        from: { address: EMAIL, name: 'Admin - Roam Trips' },
        to: emailAddress,
        subject: mailMeta[type].subject,
        text: mailMeta[type].body
    };
    await transporter.sendMail(mailOptions)

}


const sendTwillioOTP = async (metaData) => {

    let { otp, phoneNumber, emailAddress } = metaData;
    // try {
    //     await twillioClient
    //         .messages
    //         .create({ channel: 'sms', body: `Your Roam-Trips verification code is:  ${otp}`, from: 'Roam-Trips', to: phoneNumber })

    //     const transporter = nodemailer.createTransport({
    //         service: "gmail",
    //         auth: {
    //             user: EMAIL,
    //             pass: PASSWORD
    //         },
    //     });

    //     const mailOptions = {
    //         from: EMAIL,
    //         to: emailAddress,
    //         subject: "Roam-Trips One Time Password",
    //         text: `Your Roam-Trips verification code is:  ${otp}`
    //     };

    //     await transporter.sendMail(mailOptions)
    // }
    // catch (exc) {
    //     let { message } = exc;
    //     console.log({ message })
    //     if (message.includes("The 'To' number"))
    //         throw new Error('InvalidPhoneNumber')
    //     throw exc
    // }

}

module.exports = {
    findDocument,
    softDelete,
    updateDocument,
    createDocument,
    findByJoin,
    stringToArray,
    findDocumentWithPagination,
    hardDelete,
    findByJoinManyToMany,
    findDocumentWithAttributes,
    sendBulkNotification,
    createNotification,
    findByJoins,
    countRecords,
    searchByQuery,
    createAdminNotification,
    firebaseNotifications,
    sendTwillioOTP,
    emailOTP,
    sendEmail
}