const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const UserService = require('../services/User.Service');

// routes
router.post('/login', loginSchema, login);
router.post('/create', createSchema, create);
router.post('/addCryptocurrency', addCryptocurrency);

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
    //res.send({message: req.user.sub})
    UserService.addCryptocurrency(req.user, req.body)
        .then(user => res.status(200).json(user))
        .catch(next);
}

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