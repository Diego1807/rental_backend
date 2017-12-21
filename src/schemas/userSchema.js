import Joi from 'joi';

let login = Joi.object().keys({
    username: Joi.string().min(5).max(15).required(),
    password: Joi.string().min(8).max(30).required()
});
let create = Joi.object().keys({
    username: Joi.string().min(5).max(15).required(),
    password: Joi.string().min(8).max(30).required(),
    email: Joi.string().email().min(7).max(30).required(),
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    phoneNo: Joi.string().min(8).max(10).required(),
    address: Joi.string().min(8).required()
});
let update = Joi.object().keys({
    username: Joi.string().min(5).max(15),
    password: Joi.string().min(8).max(30),
    email: Joi.string().email().min(7).max(30),
    firstName: Joi.string().min(3).max(20),
    lastName: Joi.string().min(3).max(20),
    phoneNo: Joi.string().min(8).max(10),
    address: Joi.string().min(8).max(20)
});

export default {
    login,
    create,
    update
}