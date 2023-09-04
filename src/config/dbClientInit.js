/** Core dependencies */
const util = require('util');

const debug = require('debug')('node-server:index');


const setupMongoose = async (mongoose, config) => {
    try {
        const {
            MONGO_HOST,
            MONGOOSE_DEBUG,
        } = config;

        /** Plugin bluebird promise in mongoose already replaced 
         * in globally replaced promise object
         * */
        mongoose.Promise = Promise;

        mongoose.connect(
            MONGO_HOST,
            {
                // useCreateIndex: true,
                useNewUrlParser: true,
                promiseLibrary: Promise,
            }
        );

        mongoose.connection
            .on('error', () => {
                console.log({ MONGO_HOST })
                throw new Error(`unable to connect to database: ${MONGO_HOST}`);
            })
            .on('connected', () => {
                console.log(`Connected to mongoDB!`)
            });

        // print mongoose logs in dev env
        if (MONGOOSE_DEBUG)
            mongoose.set('debug', (collectionName, method, query, doc) => {
                debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
            });

    } catch (exc) {
        console.log(exc);
    }
}

const setupSequelize = async (sequelize, config) => {
    try {

        const {
            MSSQL_DB_NAME,
            MSSQL_DB_USER,
            MSSQL_DB_PASS,
            MSSQL_DB_HOST,
        } = config;

        const sequelizeInstqance = await new sequelize(
            MSSQL_DB_NAME,
            MSSQL_DB_USER,
            MSSQL_DB_PASS,
            {
                host: MSSQL_DB_HOST,
                dialect: 'postgres',
                logging: true,
                pool: {
                    max: 30,
                    min: 0,
                    acquire: 100000,
                    idle: 10000,
                    evict: 10000,
                    handleDisconnects: true

                }

            }
        )

        const authenticated = await sequelizeInstqance.authenticate();

        return sequelizeInstqance;
    } catch (exc) {
        console.log(exc);
    }
}

const setupSequelizeTesting = async (sequelize, config) => {
    try {

        const {
            TEST_DB_NAME,
            TEST_DB_USER,
            TEST_DB_PASS,
            TEST_DB_HOST,
        } = config;

        const sequelizeInstqance = await new sequelize(
            TEST_DB_NAME,
            TEST_DB_USER,
            TEST_DB_PASS,
            {
                host: TEST_DB_HOST,
                dialect: 'postgres',
                logging: false
            }
        )

        const authenticated = await sequelizeInstqance.authenticate();

        return sequelizeInstqance;
    } catch (exc) {
        console.log(exc);
    }
}

module.exports = {
    setupSequelize,
    setupSequelizeTesting,
    setupMongoose
}