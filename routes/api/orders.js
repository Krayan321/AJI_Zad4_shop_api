const express = require('express');
const router = express.Router();
const {ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } = require('http-status-codes')

const Product = require('../../models/Product');
const Order = require('../../models/Order');
const OrderState = require('../../models/OrderState');
const ProductOrder = require('../../models/ProductOrder');

const getProduct = require('../../middleware/getProduct');
const getOrderState = require('../../middleware/getOrderState');

function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
        
    return true;
    } else {
    
    return false;
    }
    
}

function ValidateNumber(input) {
    var validRegex = /^\d{9}$/;
    if (input.match(validRegex)) {
        
    return true;
    } else {
    
    return false;
    }
}


router.post('/', getOrderState, async (req, res) => {
    try {
    const order = new Order({
        orderState: req.body.orderState,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userNumber: req.body.userNumber,
        products: []
    });
    
    const productsArr = req.body.products; 
    let promises = [];
    productsArr.forEach((prod) => {
        let tmp = new ProductOrder({
            product: prod.product,
            quantity: prod.quantity,
        })

        
        try {
            promises.push(tmp.save())
        } catch {
            return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        }            
    });

    if(!ValidateEmail(req.body.userEmail)) {
        return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN + " Email " + req.body.userEmail);
    }
    if(!ValidateNumber(req.body.userNumber)) {
        return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN + " Number " + req.body.userNumber);
    }

    Promise.all(promises).then(prodOrder => {
        order.products = prodOrder;
        order.save().then(result => {
            res.status(StatusCodes.OK).send(ReasonPhrases.OK + result);
        });
    })
    
} catch(err) {
    res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
}
})


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
            res.status(StatusCodes.OK).send(ReasonPhrases.OK)
        })
});

router.get('/:id', async (req, res) => {
    Order.findById(req.params.id)
        .populate('orderState', "state")
        .exec()
        .then(docs => {
            res.status(StatusCodes.OK).send(ReasonPhrases.OK)
        })
});

router.put('/:id', async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        let orderState = await OrderState.findById(req.body.orderState)
        let updatedOrderState = await OrderState.findById(order.orderState)
        if (req.body.orderState) {
            // Object.keys(req.body).forEach((key) => {
            //     order[key] = req.body[key]
            // })
            order.orderState = req.body.orderState;
        }

        //let updatedOrderState = await OrderState.findById(order);
        
        if (orderState.sequence < updatedOrderState.sequence)
            return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN)
        const updatedOrder = await order.save();
        res.status(StatusCodes.ACCEPTED).send(ReasonPhrases.ACCEPTED);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;