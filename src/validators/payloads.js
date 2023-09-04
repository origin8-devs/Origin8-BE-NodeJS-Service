/** Third party dependencies */
const { string } = require('joi');
const joi = require('joi');
joi.objectId = require('joi-objectid')(joi)

const {
    AppData: { profession }
} = require('../imports');

const completeProfile = joi.object({
    name: joi.string().required(),
    phoneNumber: joi.string()
        .required()
        .regex(/^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/),
})

const createProduct = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    cost: joi.string().required(),
    price: joi.string().required(),
    profit: joi.string().required(),
    sales: joi.number().integer().required(),
    category: joi.string().required(),
    rating: joi.string().required()
})

const updateProduct = joi.object({
    name: joi.string(),
    image: joi.string(),
    cost: joi.string(),
    price: joi.string(),
    profit: joi.string(),
    sales: joi.number().integer(),
    category: joi.string(),
    rating: joi.string().required()
})

const updateAccount = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    designation: joi.string(),
    logo: joi.string(),
})

const createOrder = joi.object({
    fullName: joi.string().required(),
    orderDate: joi.string().required(),
    emailAddress: joi.string().required(),
    salesChannel: joi.string().required(),
    storeID: joi.number().integer().required(),
    sales: joi.number().integer().required(),
    age: joi.number().integer().required(),
})

module.exports = {
    createProduct,
    updateProduct,
    updateAccount,
    createOrder
};