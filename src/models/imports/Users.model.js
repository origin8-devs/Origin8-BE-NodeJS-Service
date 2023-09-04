/** Third party dependencies*/
const mongoose = require('mongoose');

/** Un-discriminated (without base) */
const UsersScehma = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        requied: true,
        enum: ['Super Admin', 'Admin']
    },
    designation: {
        type: String,
        requied: true
    },
    company: {
        type: mongoose.ObjectId,
        requied: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});


// UsersScehma.index(
//     {
//         name: -1
//     },
//     {
//         name: "IDX_Users-name"
//     });


/** Discriminating User Schema using Base model */
const Users = mongoose.model('Users', UsersScehma);
module.exports = Users;