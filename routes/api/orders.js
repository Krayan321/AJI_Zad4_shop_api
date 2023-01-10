const express = require('express');
const router = express.Router();

const Product = require('../../models/Product');
const Order = require('../../models/Order');
const OrderState = require('../../models/OrderState');

const getProduct = require('../../middleware/getProduct');
const getOrderState = require('../../middleware/getOrderState');

router.post('/', getOrderState, getProduct, async (req, res) => {
    try {
        const order = new Order({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userNumber: req.body.userNumber,
            products: res.products
        });
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch(err) {
        res.status(400).json(err.message);
    }
});

// router.post('/', async (req, res) => {
//     Product.findById(req.body.products)
//         .then(product => {
//         if (!product) {
//             return res.status(404).json({
//             message: "Product not found"
//             });
//         }
//         const order = new Order({
//                 //approvalDate: req.body.approvalDate,
//                 orderState: res.OrderState,
//                 userName: req.body.userName,
//                 userEmail: req.body.userEmail,
//                 userNumber: req.body.userNumber,
//                 products: req.body.products
//             });
//             console.log(order.orderState)
//         return order.save();
//         })
//         .then(result => {
//             res.status(201).json(result)
//         })
//         .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// });

router.get('/', async (req, res) => {
    Order.find()
        .populate('products', 'product_name')
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
});

router.put('/:id', async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'No order with this id'});
        if (req.body) {
            Object.keys(req.body).forEach((key) => {
                order[key] = req.body[key]
            })
        }
        const updatedOrder = await order.save();
        res.status(201).json(updatedOrder);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;