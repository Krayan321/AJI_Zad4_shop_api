const express = require('express');
const router = express.Router();
const {ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } = require('http-status-codes')

const Product = require('../../models/Product');
const Category = require('../../models/Category');

const getCategory = require('../../middleware/getCategory');
//create
router.post('/', getCategory, async (req, res) => {
    try {
        const product = new Product({
            productName: req.body.productName,
            desc: req.body.desc,
            price: req.body.price,
            weight: req.body.weight,
            categoryId: res.categoryId
        });
        if (product.price<=0) return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN + " Price " + req.body.price);
        if (product.weight<=0) return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN + " Weight " + req.body.weight);
        const newProduct = await product.save();
        res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED + newProduct);
    } catch(err) {
        res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    }
});

// router.post("/", (req, res, next) => {
//     console.log(req.body);
//     Category.findById(req.body.categoryId)
//       .then(category => {
//         if (!category) {
//           return res.status(404).json({
//             message: "Category not found"
//           });
//         }
//         const product = new Product({
//             productName: req.body.productName,
//             desc: req.body.desc,
//             price: req.body.price,
//             weight: req.body.weight,
//             categoryId: req.body.categoryId
//         });
//         return product.save();
//       })
//       .then(result => {
//         console.log(result);
//         res.status(201).json(result);
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({
//           error: err
//         });
//       });
//   });

//read all
// router.get('/', async (req, res) => {
//     try {
//         const allProducts = [];
//         const products = await Product.find().populate('categoryId', 'categoryName');
//         for (product of products) {
//              //const category = await Category.findById(product.categoryId);
//              allProducts.push({ product});
//         }
//         res.json(allProducts);
//     } catch( err) {
//         res.status(500).send(err.message);
//     }
// });

router.get("/", (req, res, next) => {
    Product.find()
      .populate('categoryId', 'category_name')
      .exec()
      .then(docs => {
        res.status(StatusCodes.OK).send(docs);
      });
  });



//read single by id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        const myProduct = [];
        const category = await Category.findById(product.categoryId);
        myProduct.push({product, category})
        res.json(myProduct);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

//update by id
router.put('/:id', getCategory, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        console.log(req.body);
        console.log("req.body");
        if (req.body) {
            Object.keys(req.body).forEach((key) => {
                product[key] = req.body[key]
            })
        }
        product.categoryId = res.categoryId;
        if (product.price<=0) return res.status(StatusCodes.FORBIDDEN).json(ReasonPhrases.FORBIDDEN + " Price " + product.price);
        if (product.weight<=0) return res.status(StatusCodes.FORBIDDEN).json(ReasonPhrases.FORBIDDEN + " Weight " + product.price);
        const updatedProduct = await product.save();
        res.status(StatusCodes.CREATED).json(ReasonPhrases.CREATED + updatedProduct);
    } catch (err) {
        res.status(getStatusCode.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR + err.message);
    }
});



// router.patch("/:id", async (req, res) => {
//     const id = req.params.id;
//     const updateOps = {};
//     for (const ops of req.body) {
//         updateOps[ops.propName] = ops.value;
//     }
//     Product.update({_id: id}, {$set: updateOps}).exec()
//         .then(result => {
//             res.status(200).json(result);
//         })
//         .catch(err => {
//             res.status(200).json(err);
//         });
    
// });

//delete
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        await product.remove();
        res.json({message: 'Product removed'});
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;