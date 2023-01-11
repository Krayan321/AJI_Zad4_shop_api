const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductOrderSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        //required: true
    }
})

module.exports = mongoose.model('productOrderSchema', ProductOrderSchema);