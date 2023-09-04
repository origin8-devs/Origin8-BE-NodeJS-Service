/** Third party dependencies*/
const _ = require('lodash');
const shortid = require('shortid')
const bcrypt = require('bcrypt');
const formidable = require('formidable');
const fs = require('fs');
const fileExt = require('path')
var AWS = require('aws-sdk');
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION, S3_BUCKET } = require('../../config');


/** Local dependencies and functions */
// const User = require('../../models/users.model');
// const Order=require('../../models/orders.model');
const s3 = new AWS.S3();

const { s3Client } = require('../../libraries');

const { signAndReturnJWT } = require('../../libraries');

// const { sendSMS } = require('./../../libraries/sms')
const {
  AppData: { roles }
} = require('../../imports');

/** Local static objects & dependencies */
const {
  AppData: { business },
  Errors: { objects: ErrorsObjects }
} = require('../../imports');
const response = require('../../libraries/response');
const { findDocument } = require('../utils/queryFunctions');


const allowedImgExt = ['.jpg', '.jpeg', '.gif', '.svg', '.png']
const allowedFileExt = ['.pdf', '.jpg', '.jpeg', '.gif', '.svg', '.png']

const checkValidFiles = (files, extension) => {
  // const returnValue = false
  for (const file of files) {
    const fileExtenstion = fileExt.extname(file.filepath)
    if (!extension.includes(fileExtenstion.toLowerCase()))
      return false
  }
  return true
}

const uploadBlogImages = async (req) => {
  
  const { userId } = req.headers.User

  /** parseFormData func is a promise to handle form data and parse it in fields and files */
  const parseFormData = async () =>
    new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
      });
      // console.log({form})
      form.parse((req), async (err, fields, files) => {
        if (err) {
          console.log('error2', err)
          throw new Error(err)
        }
        // console.log({form})
        resolve({ fields, files })
      });
    })

  let { fields, files } = await parseFormData()
  if (!files || !files.images)
    throw new Error('ValidationError')

  if (files && files.images) {
    try {
      // let uid = uuid.v4()
      let imageArr = []
      if (!Array.isArray(files.images)) {
        /**
         * if mulitple images are send to upload
         */
        imageArr.push(files.images)
      }
      else {
        imageArr = files.images
      }
      let path = [];
      if (!checkValidFiles(imageArr, allowedFileExt))
        throw new Error('ValidationError');

      try {
        for (const file of imageArr) {
          let uid = shortid.generate()
          const blob = fs.readFileSync(file.filepath)
          const fileName = `${file.originalFilename}`
          const { Location, Key, ETag } = await s3Client.uploadPictureToS3(
            `Blogs/${userId}/${uid}-${fileName}`,
            blob
          )
          path.push({ Location, Key, ETag })
        }
      } catch (error) {
        throw error
      }

      return path
    } catch (error) {
      throw error
    }
  }
}

const uploadDayImages = async (req) => {

  const { userId } = req.headers.User
  const { dayId } = req.params;
  let { tripId } = await findDocument('Days', { dayId }, 'check')

  /** parseFormData func is a promise to handle form data and parse it in fields and files */
  const parseFormData = async () =>
    new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
      });
      form.parse((req), async (err, fields, files) => {
        if (err) {
          console.log('error2', err)
          next(err);
          return;
        }
        resolve({ fields, files })
      });
    })

  let { fields, files } = await parseFormData()

  if (!files || !files.images)
    throw new Error('ValidationError')

  if (files && files.images) {
    try {
      // let uid = uuid.v4()
      let imageArr = []
      if (!Array.isArray(files.images)) {
        /**
         * if mulitple images are send to upload
         */
        imageArr.push(files.images)
      }
      else {
        imageArr = files.images
      }
      let path = [];
      if (!checkValidFiles(imageArr, allowedImgExt))
        throw new Error('ValidationError');

      try {
        for (const file of imageArr) {
          let uid = shortid.generate()
          const blob = fs.readFileSync(file.filepath)
          const fileName = `${file.originalFilename}`
          const { Location, Key, ETag } = await s3Client.uploadPictureToS3(
            `Trips/${tripId}/Days/${dayId}-${uid}-${fileName}`,
            blob
          )
          path.push({ Location, Key, ETag })
        }
      } catch (error) {
        throw error
      }

      return path
    } catch (error) {
      throw error
    }
  }
}

const uploadProfilePicture = async (req) => {
  const { userId } = req.headers.User

  /** parseFormData func is a promise to handle form data and parse it in fields and files */
  const parseFormData = async () =>
    new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
      });
      form.parse((req), async (err, fields, files) => {
        if (err) {
          console.log('error2', err)
          next(err);
          return;
        }
        resolve({ fields, files })
      });
    })

  let { fields, files } = await parseFormData()

  if (!files || !files.images)
    throw new Error('ValidationError')

  if (files && files.images) {
    try {
      // let uid = uuid.v4()
      let imageArr = []
      if (!Array.isArray(files.images)) {
        /**
         * if mulitple images are send to upload
         */
        imageArr.push(files.images)
      }
      else {
        throw new Error('MultipleImages')
        imageArr = files.images
      }
      let path = [];
      if (!checkValidFiles(imageArr, allowedImgExt))
        throw new Error('ValidationError');

      try {
        for (const file of imageArr) {
          let uid = shortid.generate()
          const blob = fs.readFileSync(file.filepath)
          const fileName = `${file.originalFilename}`
          console.log(fileName)
          const { Location, Key, ETag } = await s3Client.uploadPictureToS3(
            `Users/${userId}/${uid}-${fileName}`,
            blob
          )
          path.push({ Location, Key, ETag })
        }
      } catch (error) {
        throw error
      }

      return path
    } catch (error) {
      throw error
    }
  }
}

const uploadTripPicture = async (req) => {
  const {
    tripId = null
  } = req.params
  const { userId } = req.headers.User;

  console.log({ tripId })
  await findDocument('Trips', { tripId, isDeleted: false }, 'check')
  /** parseFormData func is a promise to handle form data and parse it in fields and files */
  const parseFormData = async () =>
    new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
      });
      form.parse((req), async (err, fields, files) => {
        if (err) {
          console.log('error2', err)
          next(err);
          return;
        }
        resolve({ fields, files })
      });
    })

  let { fields, files } = await parseFormData()

  if (!files || !files.images)
    throw new Error('ValidationError')

  if (files && files.images) {
    try {
      // let uid = uuid.v4()
      let imageArr = []
      if (!Array.isArray(files.images)) {
        /**
         * if mulitple images are send to upload
         */
        imageArr.push(files.images)
      }
      else {
        imageArr = files.images
      }
      let path = [];
      if (!checkValidFiles(imageArr, allowedImgExt))
        throw new Error('ValidationError');

      try {
        for (const file of imageArr) {
          let uid = shortid.generate()
          const blob = fs.readFileSync(file.filepath)
          const fileName = `${file.originalFilename}`
          console.log(fileName)
          const { Location, Key, ETag } = await s3Client.uploadPictureToS3(
            `Trips/${tripId}/destination/${uid}-${fileName}`,
            blob
          )
          path.push({ Location, Key, ETag })
        }
      } catch (error) {
        throw error
      }

      return path
    } catch (error) {
      throw error
    }
  }
}


const deletePicture = async (req) => {

  const {
    images
  } = req.body

  if (!images)
    throw new Error('ValidationError');

  if (Array.isArray(images)) {
    let imageToDelete = []
    images.forEach(element => {
      imageToDelete.push({
        Key: element
      })
    });
    const result = await s3Client.deletePictureToS3(imageToDelete)
    return result
  }
  else {
    let imageToDelete = [
      {
        Key: images
      }
    ]
    const result = await s3Client.deletePictureToS3(imageToDelete)
    return result
  }
}

const uploadAccommodationPictureAdmin = async (req) => {
  let { adminId } = req.headers.User;
  if (!adminId) throw new Error('NotFound')
  /** parseFormData func is a promise to handle form data and parse it in fields and files */
  const parseFormData = async () =>
    new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
      });
      form.parse((req), async (err, fields, files) => {
        if (err) {
          console.log('error2', err)
          next(err);
          return;
        }
        resolve({ fields, files })
      });
    })

  let { fields, files } = await parseFormData()

  if (!files || !files.images)
    throw new Error('ValidationError')

  if (files && files.images) {
    try {
      // let uid = uuid.v4()
      let imageArr = []
      if (!Array.isArray(files.images)) {
        /**
         * if mulitple images are send to upload
         */
        imageArr.push(files.images)
      }
      else {
        throw new Error('MultipleImages')
        imageArr = files.images
      }
      let path = [];
      if (!checkValidFiles(imageArr, allowedImgExt))
        throw new Error('ValidationError');

      try {
        for (const file of imageArr) {
          let uid = shortid.generate()
          const blob = fs.readFileSync(file.filepath)
          const fileName = `${file.originalFilename}`
          console.log(fileName)
          const { Location, Key, ETag } = await s3Client.uploadPictureToS3(
            `Admins/${adminId}/accommodation/${uid}-${fileName}`,
            blob
          )
          path.push({ Location, Key, ETag })
        }
      } catch (error) {
        throw error
      }

      return path
    } catch (error) {
      throw error
    }
  }
}

const uploadBlogImagesAdmin = async (req) => {
  let { adminId } = req.headers.User;
  if (!adminId) throw new Error('NotFound')

  /** parseFormData func is a promise to handle form data and parse it in fields and files */
  const parseFormData = async () =>
    new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
      });
      // console.log({form})
      form.parse((req), async (err, fields, files) => {
        if (err) {
          console.log('error2', err)
          next(err);
          return;
        }
        // console.log({form})
        resolve({ fields, files })
      });
    })

  let { fields, files } = await parseFormData()
  if (!files || !files.images)
    throw new Error('ValidationError')


  if (files && files.images) {
    try {
      // let uid = uuid.v4()
      let imageArr = []
      if (!Array.isArray(files.images)) {
        /**
         * if mulitple images are send to upload
         */
        imageArr.push(files.images)
      }
      else {
        imageArr = files.images
      }
      let path = [];

      if (imageArr?.length > 3)
        throw new Error('InvalidImageLength')
      if (!checkValidFiles(imageArr, allowedFileExt))
        throw new Error('ValidationError');

      try {
        for (const file of imageArr) {
          let uid = shortid.generate()
          const blob = fs.readFileSync(file.filepath)
          const fileName = `${file.originalFilename}`
          const { Location, Key, ETag } = await s3Client.uploadPictureToS3(
            `Admins/${adminId}/blogs/${uid}-${fileName}`,
            blob
          )
          path.push({ Location, Key, ETag })
        }
      } catch (error) {
        throw error
      }

      return path
    } catch (error) {
      throw error
    }
  }
}

const s3FolderStructure = {
  Users: 'ProfileImages...',
  Trips: { tripId: { Days: { dayId: '...Images' } } },
  Blogs: { blogId: '...Images' },
}


module.exports = {
  uploadProfilePicture,
  uploadTripPicture,
  deletePicture,
  uploadDayImages,
  uploadBlogImages,
  uploadAccommodationPictureAdmin,
  uploadBlogImagesAdmin,
}
