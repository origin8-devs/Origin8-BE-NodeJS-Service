/** Local functions and dependencies */
const { Response: response, verifyJWT, signAndReturnJWT } = require("../../libraries");
const { catchAsyncErrors } = require("../../imports/error.handlers");
const Company = require('../../models/imports/Company.model');
const Users = require('../../models/imports/Users.model');
const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose

const login = catchAsyncErrors(async (req, res, next) => {

    const token = req.headers.authorization;
    const { username, password } = verifyJWT(token)
    const AuthorizedUser = await Users.findOne({ username })
    if (!AuthorizedUser)
        throw new Error('NoUserExist')
    if (AuthorizedUser.password !== password)
        throw new Error('IncorrectPassword')
    let accessToken = signAndReturnJWT({ ...AuthorizedUser._doc })
    const user = await Users.aggregate([
        {
            $match: { _id: ObjectId(AuthorizedUser._id) }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company',
                foreignField: '_id',
                as: 'CompanyInformation'
            }
        }
    ])
    response(res, { success: true, accessToken, user })

});

const getUserProfile = catchAsyncErrors(async (req, res, next) => {

    let { _id: id } = req.headers.User
    const user = await Users.aggregate([
        {
            $match: { _id: ObjectId(id) }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company',
                foreignField: '_id',
                as: 'CompanyInformation'
            }
        }
    ])
    response(res, { success: true, user })

});

const updateAccount = catchAsyncErrors(async (req, res, next) => {

    let { _id: userId, company } = req.headers.User
    if (req.body.logo)
        await Company.findOneAndUpdate({ _id: company }, { logo: req.body.logo });
    delete req.body.logo
    await Users.findOneAndUpdate({ _id: userId }, { ...req.body });
    response(res, { success: true, message: "User updated!" })

});

module.exports = {
    login,
    updateAccount,
    getUserProfile
}