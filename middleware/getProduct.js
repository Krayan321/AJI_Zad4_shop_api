const Product = require('../models/Product');

module.exports = async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.body.products);
        if (!product) {
            return res.status(404).json({message: 'Cannot find product'});}
             
    } catch (err) {
        return res.status(500).json({ error: err.message});
    }

    res.productId = req.body.productId;
    next();
}