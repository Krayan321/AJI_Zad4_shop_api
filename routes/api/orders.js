const express = require('express');
const router = express.Router();

const Product = require('../../models/Product');
const Order = require('../../models/Order');
const OrderState = require('../../models/OrderState');
const ProductOrder = require('../../models/ProductOrder');

const getProduct = require('../../middleware/getProduct');
const getOrderState = require('../../middleware/getOrderState');

function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
        console.log("Valid email address!");
    return true;
    } else {
    console.log("Invalid email address!");
    return false;
    }
    
}

function ValidateNumber(input) {
    var validRegex = /^\d{9}$/;
    if (input.match(validRegex)) {
        console.log("Valid phone number!");
    return true;
    } else {
    console.log("Invalid phone number!");
    return false;
    }
}


router.post('/', getOrderState, async (req, res) => {
    try {
        // const arr = req.body.products;
        // l=arr.length
        // console.log(arr);
        // console.log();
        // for (let i = 0; i<l-1; i++ ) {
        //     arr[i] = new ProductOrder({
        //         product: req.body.products.product,
        //         quantity: req.body.products.quantity,
        //     })
        // }
        // let item = arr[0];
        // let item1 = Product.findById(item.product);
        // console.log(item1);
        // arr.forEach((index ) => {
        //     arr[index] = new ProductOrder({
        //         product: req.body.products.product,
        //         quantity: req.body.products.quantity,
        //     })
        // });
        // console.log(arr);
        const productOrder = new ProductOrder({
            product: req.body.products.product,
            quantity: req.body.products.quantity,
        })
        const order = new Order({
            orderState: req.body.orderState,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userNumber: req.body.userNumber,
            products: productOrder
        });
        
        if(!ValidateEmail(req.body.userEmail)) {
            return res.status(404).json({message: "Zły email"});
        }
        if(!ValidateNumber(req.body.userNumber)) {
            return res.status(404).json({message: "Zły numer"});
        }
        const newOrder = await order.save();
        // order
        //     .save()
        //     .then(result => {
        //         res.status(201).json({
        //             orderState: result.orderState,
        //             userName: result.userName,
        //             userEmail: result.userEmail,
        //             userNumber: result.userNumber,
        //             quantity: result.products.quantity,
                        
        //         });
        //     });
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
        .populate('products', 'productName')
        .populate('orderState', "state")
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
});

router.get('/:id', async (req, res) => {
    Order.findById(req.params.id)
        .populate('orderState', "state")
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
});

router.put('/:id', async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'No order with this id'});
        let orderState = await OrderState.findById(req.body.orderState)
        let updatedOrderState = await OrderState.findById(order.orderState)
        if (req.body) {
            Object.keys(req.body).forEach((key) => {
                order[key] = req.body[key]
            })
        }

        //let updatedOrderState = await OrderState.findById(order);

        if (orderState.sequence < updatedOrderState.sequence)
            return res.status(404).json({ message: 'You cant do that'})
        const updatedOrder = await order.save();
        res.status(201).json(updatedOrder);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;