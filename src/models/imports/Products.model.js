/** Third party dependencies*/
const mongoose = require('mongoose');

/** Un-discriminated (without base) */
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: false,
        default: "0.0"
    },
    productID: {
        type: Number,
        required: true,
        unique: true
    },
    cost: {
        type: String,
        required: true
    },
    profit: {
        type: String,
        required: true
    },
    sales: {
        type: Number,
        requied: false,
        default: 0
    },
    price: {
        type: String,
        requied: true
    },
    image: {
        type: String,
        requied: true
    },
    category: {
        type: String,
        requied: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.ObjectId,
        required: false,
        default: null,
    },
    updatedBy: {
        type: mongoose.ObjectId,
        required: false,
        default: null,
    },
},
    {
        timestamps: true,
    });


// ProductSchema.index(
//     {
//         name: -1
//     },
//     {
//         name: "IDX_Products-name"
//     });


/** Discriminating User Schema using Base model */
const Products = mongoose.model('Products', ProductSchema);
module.exports = Products;