const express = require('express');
const router = express.Router();
const {ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } = require('http-status-codes')

const Category = require('../../models/Category');

router.post('/', async (req, res) => {
    try {
        const category = new Category({
            categoryName: req.body.categoryName
        });

        const newCategory = await category.save();
        res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED + newCategory);
    } catch(err) {
        res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST + err.message);
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR + err.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        if (req.body.category) category.category = req.body.category;
        const updatedCategory = await category.save();
        res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED + updatedCategory);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;