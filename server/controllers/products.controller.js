var config = require('config.json');
var express = require('express');
var router = express.Router();
var productService = require('services/product.service');

// routes
router.get('/', getAll);
router.post('/create', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function getAll(req, res) {
    
    productService.getAll()
        .then(function (products) {
            res.send(products);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    productService.getById(req.product.sub)
        .then(function (product) {
            if (product) {
                res.send(product);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    
    productService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    console.log("Id : "+req.params._id)
    productService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function create(req, res) {
    productService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}

