const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId, 
        ref: 'category',
        required: true
    }

})

module.exports = mongoose.model('product', ProductSchema);