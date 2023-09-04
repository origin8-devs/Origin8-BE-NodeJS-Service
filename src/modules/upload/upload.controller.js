const {
    uploadProfilePicture,
    uploadTripPicture,
    deletePicture,
    uploadDayImages,
    uploadBlogImages,
    uploadAccommodationPictureAdmin,
    uploadBlogImagesAdmin,
} = require('../upload/upload.service');

const { ErrorsFactory } = require('../../factories');

const { Response: response } = require('../../libraries');
const { messaging } = require('firebase-admin');

const { Parser } = require('json2csv');
const { roles } = require('../../imports/appData');
const { catchAsyncErrors } = require('../../imports/error.handlers');

const uploadProfileImage = catchAsyncErrors(async (req, res, next) => {

    const loggedInUser = await uploadProfilePicture(req);
    response(res, loggedInUser);

});


const uploadBlogImage = catchAsyncErrors(async (req, res, next) => {

    const apiResponse = await uploadBlogImages(req);
    response(res, apiResponse);

})



const uploadDayImage = catchAsyncErrors(async (req, res, next) => {

    const apiResponse = await uploadDayImages(req);
    response(res, apiResponse);

})



const uploadTripImage = catchAsyncErrors(async (req, res, next) => {

    const loggedInUser = await uploadTripPicture(req);
    response(res, loggedInUser);

});




const removeImage = catchAsyncErrors(async (req, res, next) => {

    const apiResponse = await deletePicture(req);
    response(res, apiResponse);

});

const uploadAccommodationImageAdmin = catchAsyncErrors(async (req, res, next) => {

    const loggedInUser = await uploadAccommodationPictureAdmin(req);
    response(res, loggedInUser);

});

const uploadBlogImageAdmin = catchAsyncErrors(async (req, res, next) => {

    const loggedInUser = await uploadBlogImagesAdmin(req);
    response(res, loggedInUser);

});





module.exports = {
    uploadProfileImage,
    uploadTripImage,
    removeImage,
    uploadDayImage,
    uploadBlogImage,
    uploadAccommodationImageAdmin,
    uploadBlogImageAdmin,
};


