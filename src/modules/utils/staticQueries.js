const { Op } = require('sequelize')
const queries = {

    trips: {
        isPublished: true,
        isDeleted: false,
        startDate: { [Op.gt]: new Date() },
        endDate: { [Op.gte]: new Date() },
    }

}

module.exports = queries