const { safeAttributes } = require("../tests/helpers");
const moment = require("moment");
const { Op } = require("sequelize");
const {
  dbSetup,
  createNotification,
  updateDocument,
  createDocument,
} = require("./preReqs");
const appData = require("../imports/appData");
let { type: notificationTypes } = appData.Notifications;

(async () => {
  let dbInstance = await dbSetup();
  if (!dbInstance) return process.exit(0);

  let models = dbInstance?.models;
  let { CronLogs, Trips, Admin, BookTrips } = models;
  let transaction = await dbInstance?.transaction();

  let { id } = await createDocument(models, "CronLogs", {
    job: "Trip Reminder Started",
  });

  try {
    // const today = moment().startOf("day");
    // moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
    const daysLater = moment().add(3, "days").format("YYYY-MM-DD") + "T00:00:00.000Z";
    const daysLaterEnd = moment().add(4, "days").format("YYYY-MM-DD") + "T00:00:00.000Z";

    // const daysLaterEnd = moment().add(3, "days").endOf("day");

    const trips = await models.Trips.findAll(
      {
        where: {
          isPublished: true,
          isDeleted: false,
          startDate: {
            [Op.between]: [daysLater, daysLaterEnd],
          },
        },
        attributes: ["tripId"],
        raw: true,
      }
    );

    if (!trips?.length) {
      console.log('No pending reminders!');
      await updateDocument(
        models,
        "CronLogs",
        {
          type: "Success",
          job: "Trip Reminder",
          reason: "No pending reminders!",
        },
        { id }
      );
      return process.exit(0);
    }
    let admin = await Admin.findAll({
      limit: 1,
      raw: true,
      attributes: ["adminId", "name"],
    });

    await Promise.all(
    trips.map(async ({ tripId }) => {

      let receivers = await BookTrips.findAll({
        where: { tripId },
        raw: true,
        attributes: ["userId", "tripId"],
      });

      await createNotification(models, {
        adminId: admin[0]?.adminId,
        receiverId: receivers,
        type: notificationTypes["TripReminder"],
        text: `Your trip is approaching in 3 days!`,
        senderName: admin[0]?.name,
        receiverName: "All Users with Booking",
        tripId,
        transaction,
      });

    })
    );

    await updateDocument(
      models,
      "CronLogs",
      {
        type: "Success",
        job: "Trip Reminder",
      },
      { id }
    );

    await transaction.commit();
    return process.exit(0);
  } catch (e) {
    console.log(e.message);
    await transaction.rollback();
    await updateDocument(
      models,
      "CronLogs",
      {
        type: "Error",
        job: "Trip Reminder",
        reason: e.message,
      },
      { id }
    );
    return process.exit(0);
  }
})();
