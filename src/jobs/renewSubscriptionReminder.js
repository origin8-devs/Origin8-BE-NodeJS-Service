const moment = require("moment");
const { Op } = require("sequelize");
const appData = require("../imports/appData");
let { type: notificationTypes } = appData.Notifications;
const { safeAttributes } = require("../tests/helpers");
const { dbSetup, createNotification, updateDocument, createDocument } = require("./preReqs");

(async () => {
  let dbInstance = await dbSetup()
  if (!dbInstance) return process.exit(0);

  let models = dbInstance?.models
  let { CronLogs, Trips, Admin, BookTrips } = models;
  let transaction = await dbInstance?.transaction();

  let { id } = await createDocument(models, "CronLogs", {
    job: "Renew Subscription Reminder Started",
  });

  try {

    const tomorrow =
      moment().add(1, "day").format("YYYY-MM-DD") + "T00:00:00.000Z";
    const dayAfterTomorrow =
      moment().add(2, "day").format("YYYY-MM-DD") + "T00:00:00.000Z";

    const users = await models.Subscriptions.findAll(
      {
        where: {
          planId: {
            [Op.in]: [5, 6],
          },
          userId: {
            [Op.ne]: null
          },
          expiry: {
            [Op.between]: [tomorrow, dayAfterTomorrow],
          },
        },
        attributes: ["userId"],
        raw: true,
      },
      { transaction }
    );
    if (!users?.length) {
      console.log("No subsriptions are expiring tomorrow!");
      await updateDocument(models, "CronLogs", {
        type: "Success",
        job: "Renew Subscription Reminder",
        reason: "No subsriptions are expiring tomorrow!"
      }, { id });
      return process.exit(0);
    }

    let admin = await models.Admin.findOne({
      attributes: ["adminId", "name"],
      raw: true
    });

    await createNotification(models, {
      adminId: admin.adminId,
      receiverId: users,
      type: notificationTypes["RenewSubscriptionReminder"],
      text: `Your subscription expires tomorrow!`,
      senderName: admin.name,
      receiverName: "All Users with expiring subsriptions",
      transaction,
    });

    await updateDocument(models, "CronLogs", {
      type: "Success",
      job: "Renew Subscription Reminder",
    }, { id });

    await transaction.commit();

    return process.exit(0);

  } catch (e) {

    console.log(e);
    await transaction.rollback();
    await updateDocument(models, "CronLogs", {
      type: "Error",
      job: "Renew Subscription Reminder",
      reason: e.message,
    }, { id });
    return process.exit(0);

  }
})()