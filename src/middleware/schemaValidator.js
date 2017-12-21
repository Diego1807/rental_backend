var Joi = require('joi');

export default function(req, res, next, schema) {
    Joi.validate(req.body, schema, function(err, value) {
        if(err) {
            res.status(422).json({error: err.details[0].message});
        } else {
            next();
        }
    });
}