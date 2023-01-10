const Category = require('../models/Category');

module.exports = async function getCategory(req, res, next) {
    let category;
    try {
        category = await Category.findById(req.body.categoryId);
        if (!category) {
            return res.status(404).json({message: 'Cannot find category'});}
             
    } catch (err) {
        return res.status(500).json({ error: err.message});
    }
    res.categoryId = req.body.categoryId;
    next();
}