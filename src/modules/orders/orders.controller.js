/** Local functions and dependencies */
const { Response: response } = require("../../libraries");
const { catchAsyncErrors } = require("../../imports/error.handlers");
const Orders = require("../../models/imports/Orders.model");
const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose;

const orderList = catchAsyncErrors(async (req, res, next) => {

    let { limit = 10, offset = 0 } = req.query;
    const orders = await Orders
        .aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'cart.productID',
                    foreignField: 'productID',
                    as: 'products',
                },
            },
            {
                $addFields: {
                    cart: {
                        $map: {
                            input: '$cart',
                            as: 'item',
                            in: {
                                productId: '$$item.productID',
                                quantity: '$$item.quantity',
                                product: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$products',
                                                cond: {
                                                    $eq: ['$$this.productID', '$$item.productID'],
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            {
                $sort: { 'orderDate': -1 } // Sort by month
            }

        ])
        .skip((+offset) * (+limit))
        .limit(+limit)
    const totalRecords = await Orders.count()
    let metaData = { limit, offset, totalRecords }
    response(res, { success: true, orders, metaData })

});

const getOrder = catchAsyncErrors(async (req, res, next) => {

    let { id } = req.params;
    const order = await Orders.aggregate([
        {
            $match: {
                _id: ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'cart.productID',
                foreignField: 'productID',
                as: 'products',
            },
        },
        {
            $addFields: {
                cart: {
                    $map: {
                        input: '$cart',
                        as: 'item',
                        in: {
                            productId: '$$item.productID',
                            quantity: '$$item.quantity',
                            product: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$products',
                                            cond: {
                                                $eq: ['$$this.productID', '$$item.productID'],
                                            },
                                        },
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                },
            },
        },
    ])
    response(res, { success: true, order })

});


const update = catchAsyncErrors(async (req, res, next) => {

    let { id } = req.params;
    const order = await Orders.findOneAndUpdate({ _id: id }, { ...req.body });
    response(res, { success: true, order })

});

const create = catchAsyncErrors(async (req, res, next) => {

    const order = await Orders.create({ ...req.body });
    response(res, { success: true, order })

});


module.exports = {
    orderList,
    getOrder,
    create,
    update
}