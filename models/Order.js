const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    // approvalDate: {
    //     type: Date,
    //     //required: true,
    //     default: null
    // },
    orderState: {
        type: Schema.Types.ObjectId, 
        ref: 'orderState',
        //default: '63bdce080b17149bf05b85a9'
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
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'productOrder'
    }]
})

module.exports = mongoose.model('order', OrderSchema);