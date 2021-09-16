const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const UserService = require('../services/User.Service');

// routes
router.post('/login', loginSchema, login);
router.post('/create', createSchema, create);
router.post('/addCryptocurrency', addCryptoSchema, addCryptocurrency);
router.post('/getTopNCryptos', getTopNSchema, getTopNCryptos);

module.exports = router;

//functions
function login(req, res, next) {
    UserService.login(req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function create(req, res, next) {
    UserService.create(req.body)
        .then(() => res.json({message: "Se creo correctamente el usuario."}))
        .catch(err => next(err))
}

function addCryptocurrency(req, res, next) {
    UserService.addCryptocurrency(req.user, req.body)
    .then(() => res.json({message: "Se agregaron correctamente las criptomonedas al usuario."}))
        .catch(next);
}

function getTopNCryptos(req, res, next) {
    UserService.getTopNCryptos(req.user, req.body)
        .then(cryptos => res.json(cryptos))
        .catch(next);
}

//schema validators
function loginSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required().alphanum().min(8),
        firstname:  Joi.string().required(), 
        lastname: Joi.string().required(),
        preferedCurrency: Joi.string().valid("eur", "usd", "ars").required(),
    });
    validateRequest(req, next, schema);
}

function addCryptoSchema(req, res, next) {
    const schema = Joi.object({
        cryptoCurrencies: Joi.array()
            .items({
                crypto_id: Joi.string().required(),
            })
    });
    validateRequest(req, next, schema);
}

function getTopNSchema(req, res, next) {
    const schema = Joi.object({
        n: Joi.number().max(25).required(),
        order: Joi.string().valid("asc", "desc", "").optional(),
    });
    validateRequest(req, next, schema);
}