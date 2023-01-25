const express = require('express');
const router = express.Router();

const OrderState = require('../../models/OrderState');

router.get('/', async (req, res) => {
    OrderState.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({error:err});
    })
});

router.post('/', async (req, res) => {
    try {
        const orderState = new OrderState({
            state: req.body.state,
            sequence: req.body.sequence
        });

        const newOrderState = await orderState.save();
        res.status(201).json(newOrderState);
    } catch(err) {
        res.status(400).json(err.message);
    }
});

module.exports = router;