const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const CryptoCurrencyService = require('../services/CryptoCurrency.Service');

// routes
router.get('/getAll', getAll);

module.exports = router;

//functions
function getAll(req, res, next) {
    CryptoCurrencyService.getAll(req.user)
        .then(cryptos => res.json(cryptos))
        .catch(err => next(err));
}