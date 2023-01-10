const OrderState = require('../models/OrderState');

module.exports = async function getOrderStatus(req, res, next) {
    let orderState;
    try {
        orderState = await OrderState.findById(req.body.orderState);
        console.log(req.body);
        if (!orderState) {
            return res.status(404).json({message: 'Cannot find orderState'});}
             
    } catch (err) {
        return res.status(500).json({ error: err.message});
    }

    next();
}