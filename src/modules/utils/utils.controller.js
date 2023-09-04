/** Local functions and dependencies */
const { Response: response, signAndReturnJWT } = require("../../libraries");
const { catchAsyncErrors } = require("../../imports/error.handlers");
const Company = require('../../models/imports/Company.model');
const Users = require('../../models/imports/Users.model');
const Products = require('../../models/imports/Products.model');
const { default: mongoose } = require("mongoose");


const utility = catchAsyncErrors(async (req, res, next) => {

    const products = await Products.find()
    response(res, { success: true, products })

});

const generateToken = catchAsyncErrors(async (req, res, next) => {

    const token = signAndReturnJWT({ ...req.body })
    response(res, { success: true, token })

});


module.exports = {
    utility,
    generateToken
};
