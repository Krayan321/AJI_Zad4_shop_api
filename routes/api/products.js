const express = require('express');
const router = express.Router();

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
        if (product.price<=0) return res.status(404).json({message: "Cena musi być więszka niż 0!"});
        if (product.weight<=0) return res.status(404).json({message: "Waga musi być więszka niż 0!"});
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch(err) {
        res.status(400).json(err.message);
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
        res.status(200).json(docs);
      });
  });



//read single by id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'No product with this id'});
        const myProduct = [];
        const category = await Category.findById(product.categoryId);
        myProduct.push({product, category})
        res.json(myProduct);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//update by id
router.put('/:id', getCategory, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'No product with this id'});
        console.log(req.body);
        console.log("req.body");
        if (req.body) {
            Object.keys(req.body).forEach((key) => {
                product[key] = req.body[key]
            })
        }
        product.categoryId = res.categoryId;
        if (product.price<=0) return res.status(404).json({message: "Cena musi być więszka niż 0!"});
        if (product.weight<=0) return res.status(404).json({message: "Waga musi być więszka niż 0!"});
        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);
    } catch (err) {
        res.status(500).send(err.message);
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
        if (!product) return res.status(404).json({ message: 'No product with this id'});
        await product.remove();
        res.json({message: 'Product removed'});
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;