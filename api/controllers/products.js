const mongoose = require("mongoose");
const Product = require("../models/product");


exports.products_get_all = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                products: docs.map((doc) => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/product/" + doc._id,
                        },
                    };
                }),
            };
            res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.products_create_product = async (req, res) => {
    try {
        // Check if required fields are present
        if (!req.body.name || !req.body.price) {
            return res.status(400).json({ message: "Name and price are required fields." });
        }

        // Create a new product
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path,
        });

        // Save the product to the database
        const result = await product.save();

        res.status(201).json({
            message: "Product Created Successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                _id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/product/" + result._id,
                },
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message,
        });
    }
}

exports.produts_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("name price_id productImage")
        .exec()
        .then((doc) => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products",
                    },
                });
            } else {
                res.status(404).json({ message: "No valid entry found" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.update_a_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id,
                },
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.product_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "Product Deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products",
                    body: { name: "String", price: "Number" },
                },
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}