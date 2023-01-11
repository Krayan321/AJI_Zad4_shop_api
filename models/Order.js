const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    approvalDate: {
        type: Date,
        //required: true,
        default: null
    },
    orderState: {
        type: Schema.Types.ObjectId, 
        ref: 'orderState',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userNumber: {
        type: String,
        required: true
    },
    products: {
        item: {
            type: Schema.Types.ObjectId, 
            ref: 'product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }
})

module.exports = mongoose.model('order', OrderSchema);