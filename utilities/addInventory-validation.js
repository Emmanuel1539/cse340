const { body, validationResult } = require('express-validator');
const invModel = require('../models/inventory-model');
const validate = {};

// Classification data validation rules
validate.classificationRules = () => {
    return [
        // Classification name is required, no spaces or special characters
        body('classification_name')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Classification name is required.')
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage('Classification name cannot contain spaces or special characters.'),
    ];
};

// Middleware to check for validation errors
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('inventory/add-classification', {
            errors,
            title: 'Add New Classification',
            nav,
            classification_name,
        });
        return;
    }

    next();
};

module.exports = validate;
