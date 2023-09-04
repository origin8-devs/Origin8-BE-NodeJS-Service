/** Third party dependencies*/
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    productId: {
        type: Number,
        required: true,
    },
})

/** Un-discriminated (without base) */
const OrderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    orderDate: {
        type: String,
        required: true,
    },
    cart: {
        type: [cartSchema],
        required: true
    },
    quantityMap: {
        type: Object,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        requied: true
    },
    storeID: {
        type: Number,
        requied: true
    },
    salesChannel: {
        type: String,
        requied: true,
        enum: ['Store', 'Online']
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});


// OrderSchema.index(
//     {
//         name: -1
//     },
//     {
//         name: "IDX_Products-name"
//     });


/** Discriminating User Schema using Base model */
const Orders = mongoose.model('Orders', OrderSchema);
module.exports = Orders;