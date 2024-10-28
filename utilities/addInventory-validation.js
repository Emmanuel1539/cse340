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
    const errors = validationResult(req); // Get validation errors

    // If there are validation errors, render the add-classification view with errors
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        return res.render('./inventory/addClassification', {
            errors: errors.array(), // Pass array of errors
            title: 'Add New Classification',
            nav,
        
        });
    }

    // No validation errors, proceed to the next middleware
    next();
};

module.exports = validate;
