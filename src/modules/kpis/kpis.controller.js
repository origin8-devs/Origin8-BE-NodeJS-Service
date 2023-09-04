/** Local functions and dependencies */
const { Response: response } = require("../../libraries");
const { catchAsyncErrors } = require("../../imports/error.handlers");
const Orders = require("../../models/imports/Orders.model");
const Products = require("../../models/imports/Products.model");
const { default: mongoose } = require("mongoose");
const config = require("../../config");
const { Types: { ObjectId } } = mongoose;
const { MongoClient } = require('mongodb');

const kpiScores = catchAsyncErrors(async (req, res, next) => {

    let { limit = 10, offset = 0 } = req.query;
    const revenue = await Orders
        .aggregate([
            { $unwind: '$cart' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'cart.productID',
                    foreignField: 'productID',
                    as: 'productInfo',
                },
            },
            {
                $unwind: '$productInfo',
            },
            {
                $addFields: {
                    productPrice: { $toDouble: '$productInfo.price' }, // Convert price to number
                    productCost: { $toDouble: '$productInfo.cost' } // Convert price to number
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ['$cart.quantity', '$productPrice'] } },
                    totalCost: { $sum: { $multiply: ['$cart.quantity', '$productCost'] } },
                    totalSales: { $sum: '$cart.quantity' },
                },
            },
            { $sort: { _id: 1 } }
        ])
    const products = await Products.count()
    const orders = await Orders.count()

    response(res, { success: true, revenue, products, orders })

});

const productKPIList = catchAsyncErrors(async (req, res, next) => {

    let { limit = 10, offset = 0 } = req.query;
    const kpis = await Orders
        .aggregate([
            { $unwind: '$cart' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'cart.productID',
                    foreignField: 'productID',
                    as: 'productInfo',
                },
            },
            {
                $unwind: '$productInfo',
            },
            {
                $addFields: {
                    productPrice: { $toDouble: '$productInfo.price' }, // Convert price to number
                    productCost: { $toDouble: '$productInfo.cost' } // Convert price to number
                },
            },
            {
                $group: {
                    _id: '$cart.productID',
                    totalRevenue: { $sum: { $multiply: ['$cart.quantity', '$productPrice'] } },
                    totalCost: { $sum: { $multiply: ['$cart.quantity', '$productCost'] } },
                    totalSales: { $sum: '$cart.quantity' },
                },
            },
            { $sort: { _id: 1 } }
        ])
        .skip((+offset) * (+limit))
        .limit(+limit)

    response(res, { success: true, kpis })

});

const dashboardGraph = catchAsyncErrors(async (req, res, next) => {

    let { year = 2019 } = req.query;
    const sales = await Orders
        .aggregate([
            {
                $addFields: {
                    orderDate: {
                        $toDate: '$orderDate',
                    },
                },
            },
            {
                $match: {
                    orderDate: {
                        $gte: new Date(+year, 0, 1),
                        $lt: new Date(+year + 1, 0, 1),
                    },
                },
            },
            { $unwind: '$cart' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'cart.productID',
                    foreignField: 'productID',
                    as: 'productInfo',
                },
            },
            {
                $unwind: '$productInfo',
            },
            {
                $addFields: {
                    productPrice: { $toDouble: '$productInfo.price' }, // Convert price to number
                    productCost: { $toDouble: '$productInfo.cost' } // Convert price to number
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$orderDate' },
                    },
                    unitsSold: { $sum: '$cart.quantity' },
                    revenue: { $sum: { $multiply: ['$cart.quantity', '$productPrice'] } },
                    cost: { $sum: { $multiply: ['$cart.quantity', '$productCost'] } },
                },
            },
            {
                $sort: { '_id.month': 1 } // Sort by month
            }
        ])
    response(res, { success: true, sales })

});

const dbStats = catchAsyncErrors(async (req, res, next) => {

    const { db: dbName = 'Origin8-Dev' } = req.query;
    const client = new MongoClient(config.MONGO_HOST);
    await client.connect();
    const db = client.db(dbName);
    const result = await db.command({ whatsmyuri: 1 });
    const maxStorageSizeBytes = result.maxBsonObjectSize + result.maxMessageSize;
    const storageStats = await db.stats();
    await client.close();
    response(res, { success: true, storageStats, maxStorageSizeBytes, result })

});


module.exports = {
    kpiScores,
    dashboardGraph,
    productKPIList,
    dbStats
}