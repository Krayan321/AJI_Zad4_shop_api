const express = require('express');
const router = express.Router();

const Category = require('../../models/Category');

router.post('/', async (req, res) => {
    try {
        const category = new Category({
            categoryName: req.body.categoryName
        });

        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch(err) {
        res.status(400).json(err.message);
    }
});

//read all
router.get('/', async (req, res) => {
    try {
        const allCategories = [];
        const categories = await Category.find();
        for (category of categories) {
            allCategories.push(category);
        }
        res.json(allCategories);
    } catch( err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        if (req.body.category) category.category = req.body.category;
        const updatedCategory = await category.save();
        res.status(201).json(updatedCategory);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;