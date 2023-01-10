const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OrderStateSchema = new Schema({
    state: {
        type: String,
        default: "63bdce080b17149bf05b85a9"
    },
    sequence: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('orderState', OrderStateSchema);