/** Local functions and dependencies */
const { Response: response } = require("../../libraries");
const { catchAsyncErrors } = require("../../imports/error.handlers");
const Products = require("../../models/imports/Products.model");


const productList = catchAsyncErrors(async (req, res, next) => {

    let { limit = 10, offset = 0 } = req.query;
    let { category = null, query = null, sortBy } = req.body;
    let options = { search: {}, sort: {} }
    if (query)
        options.search.name = { $regex: query, $options: 'i' }
    if (category)
        options.search.category = category
    if (sortBy)
        options.sort = { [sortBy]: -1 }
    const products = await Products
        .find({ ...options.search })
        .sort({ ...options.sort })
        .skip((+offset) * (+limit))
        .limit(+limit)
    const totalRecords = await Products.count({ ...options.search })
    const metaData = { offset, limit, totalRecords }
    response(res, { success: true, products, metaData })

});

const getProduct = catchAsyncErrors(async (req, res, next) => {

    let { id } = req.params;
    const product = await Products.findById(id)
    response(res, { success: true, product })

});


const update = catchAsyncErrors(async (req, res, next) => {

    let { _id: userId } = req.headers.User;
    let { id } = req.params;
    const product = await Products.findOneAndUpdate({ _id: id }, { ...req.body, updatedBy: userId });
    response(res, { success: true, message: 'Product Updated!', product })

});

const create = catchAsyncErrors(async (req, res, next) => {

    let { _id: userId } = req.headers.User;
    const [maxProductID] = await Products
        .find()
        .sort({ productID: -1 })
        .limit(1)
    const product = await Products.create({ ...req.body, createdBy: userId, productID: maxProductID.productID + 1 });
    response(res, { success: true, product })

});


module.exports = {
    productList,
    getProduct,
    create,
    update
}