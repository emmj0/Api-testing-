const express = require('express');
const { Product, products } = require('../models/product');
const router = express.Router();

router.get('/', (req, res) => {
    res.json(products);
});

router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
});

router.post('/', (req, res) => {
    const { productName } = req.body;
    if (!productName) return res.status(400).send('Product name is required');

    const newProduct = new Product(productName);
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.put('/:id', (req, res) => {
    const { productName } = req.body;
    const product = products.find(p => p.id === req.params.id);

    if (!product) return res.status(404).send('Product not found');
    if (!productName) return res.status(400).send('Product name is required');

    product.productName = productName;
    res.json(product);
});

router.delete('/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) return res.status(404).send('Product not found');

    const deletedProduct = products.splice(productIndex, 1);
    res.json(deletedProduct[0]);
});

module.exports = router;
