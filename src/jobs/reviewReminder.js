const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const appData = require("../imports/appData");
let { type: notificationTypes } = appData.Notifications;
const { safeAttributes } = require("../tests/helpers");
const config = require("../config");
const process = require("process");
const { dbSetup, createNotification, updateDocument } = require("./preReqs");

(async () => {
  let dbInstance = await dbSetup();
  if (!dbInstance) return process.exit(0);

  let models = dbInstance?.models;
  let { CronLogs, Trips, Admin, BookTrips } = models;
  let transaction = await dbInstance?.transaction();
  let { id } = await CronLogs.create({ job: "Review Reminder Started" });

  try {
    const today = moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
    const yesterday =
      moment().subtract(1, "day").format("YYYY-MM-DD") + "T00:00:00.000Z";

    const trips = await Trips.findAll(
      {
        where: {
          isPublished: true,
          isCompleted: false,
          isDeleted: false,
          endDate: {
            [Op.between]: [yesterday, today],
          },
        },
        attributes: ["tripId"],
        raw: true,
      },
      { transaction }
    );

    if (!trips?.length) {
      console.log('No trips to be reviewed!');
      await CronLogs.update(
        {
          type: "Success",
          job: "Review Reminder",
          reason: "No trips to be reviewed!",
        },
        { where: { id } }
      );
      return process.exit(0);
    }
    await Trips.update(
      { isCompleted: true },
      { where: { [Op.or]: trips } },
      { transaction }
    );

    let admin = await Admin.findAll({
      limit: 1,
      raw: true,
      attributes: ["adminId", "name"],
    });

    await Promise.all(
    trips?.map(async ({ tripId }) => {

      let receivers = await BookTrips.findAll({
        where: { tripId },
        raw: true,
        attributes: ["userId", "tripId"],
      });

      await createNotification(models, {
        adminId: admin[0]?.adminId,
        receiverId: receivers,
        type: notificationTypes["ReviewReminder"],
        text: `Please leave a review for your trip`,
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
        job: "Review Reminder",
      },
      { id }
    );
    await transaction.commit();
    return process.exit(0);
  } catch (e) {
    console.log(e);
    await transaction.rollback();
    await updateDocument(
      models,
      "CronLogs",
      {
        type: "Error",
        job: "Review Reminder",
        reason: e.message,
      },
      { id }
    );
    process.exit(0);
  }
})();
