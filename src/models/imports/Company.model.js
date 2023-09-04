/** Third party dependencies*/
const mongoose = require('mongoose');

const { ObjectId } = require('mongoose');

/** Un-discriminated (without base) */
const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});


// Company.index(
//     {
//         name: -1
//     },
//     {
//         name: "IDX_Users-name"
//     });


/** Discriminating User Schema using Base model */
const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;