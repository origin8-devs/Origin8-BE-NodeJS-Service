const { Sequelize } = require('sequelize');
/** Third party dependencies */

const fs = require('fs');

const util = require('util');

const path = require('path');

/** Local dependencies & Functions */
const {
    setupSequelize,
    setupSequelizeTesting,
    setupMongoose
} = require('../config/dbClientInit');

const {
    SEED,
} = require('../config');

const {
    getGen
} = require('../libraries/common');


/** Local imports & constants */
const config = require('../config');
const { default: mongoose } = require('mongoose');


const readDir = util.promisify(fs.readdir);


module.exports = async () => {

    const {
        MSSQL_DB_HOST,
        MONGO_HOST,
        MONGOOSE_DEBUG
    } = config;

    let dbInstance = null

    /** Setting up mongoose if mongo credentials were found uncommented */
    if (MONGO_HOST)
        dbInstance = await setupMongoose(
            mongoose,
            { MONGO_HOST, MONGOOSE_DEBUG }
        );

}