const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductOrderSchema = new Schema({
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('productOrderSchema', ProductOrderSchema);