/** Third party dependencies*/
const { Router } = require('express');


/** Local dependencies and functions */
const {
    uploadProfileImage,
    uploadTripImage,
    removeImage,
    uploadDayImage,
    uploadBlogImage,
    uploadAccommodationImageAdmin,
    uploadBlogImageAdmin
} = require('./upload.controller');

const {
    verifyToken,
    verifyTokenCognito,
    schemaValidator,
    verifyTokenSignUp
} = require('../../middlewares');
const { verifyAdminToken } = require('../../middlewares/verifyToken');


const router = Router();

router.post(
    '/uploadTrips/:tripId',
    verifyToken,
    uploadTripImage
)


router.post(
    '/uploadProfile',
    verifyToken,
    uploadProfileImage
)

router.post(
    '/uploadDays/:dayId',
    verifyToken,
    uploadDayImage
)


router.post(
    '/uploadBlog',
    verifyToken,
    uploadBlogImage
)

router.post(
    '/uploadAccommodationAdmin',
    verifyAdminToken,
    uploadAccommodationImageAdmin
)

router.post(
    '/uploadBlogAdmin',
    verifyAdminToken,
    uploadBlogImageAdmin
)

router.delete(
    '/remove',
    verifyToken,
    removeImage
)


module.exports = router;