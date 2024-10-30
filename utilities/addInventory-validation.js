const { body, validationResult } = require('express-validator');
const invModel = require('../models/inventory-model');
const utilities = require('../utilities')
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
            .withMessage('Classification name cannot contain spaces or special characters.')
            .custom(async (classification_name) => {
                const classificationExist = await invModel.checkExistingClassifiactionName(classification_name)
                if(classificationExist){
                    throw new Error('Sorry name already exists.') 
                }
            })
    ];
    
};

// Middleware to check for validation errors
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    const errors = validationResult(req); // Get validation errors

    // If there are validation errors, render the add-classification view with errors
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
            res.render('./inventory/add-classification', {
            errors: errors.array(), // Pass array of errors
            title: 'Add New Classification',
            nav,
            classification_name,
        
        });
        return
    }

    // No validation errors, proceed to the next middleware
    next();
};

// Add Inventory data validation rules
validate.addInventoryRules = () => {
    return [
        
        body('classification_id')
            .isInt({ min: 1 })
            .withMessage('Please select a valid classification.'),

        
        body('inv_make')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide the vehicle make.'),

        
        body('inv_model')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide the vehicle model.'),

       
        body('inv_year')
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage('Please provide a valid year.'),

        body('inv_description')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage('Please provide a description of at least 10 characters.'),

        
        body('inv_image')
            .trim()
            .isURL()
            .withMessage('Please provide a valid image URL.'),

        
        body('inv_thumbnail')
            .trim()
            .isURL()
            .withMessage('Please provide a valid thumbnail URL.'),

       
        body('inv_price')
            .isFloat({ min: 0 })
            .withMessage('Please provide a valid price.'),

      
        body('inv_miles')
            .isInt({ min: 0 })
            .withMessage('Please provide a valid mileage.'),

        body('inv_color')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a color for the vehicle.')
    ];
};

// Check Add Inventory data
validate.checkInventoryData = async (req, res, next) => {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    } = req.body;

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList(); // Populate classification list for the select dropdown
        res.render('inventory/add-inventory', {
            errors,               // Display validation errors
            title: 'Add New Inventory',
            nav,
            classificationList,   // Pass the classification list to the view
            classification_id,    // Sticky input data
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        });
        return;
    }
    next();
};


// New inventory data validation rules
validate.newInventoryRules = () => {
    return [
        // Make is required
        body('inv_make')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a make.'),

        // Model is required
        body('inv_model')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a model.'),

        // Year is required and must be an integer within valid range
        body('inv_year')
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage('Please provide a valid year.'),

        // Price is required and must be a positive float
        body('inv_price')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number.'),

        // Miles must be a non-negative integer
        body('inv_miles')
            .isInt({ min: 0 })
            .withMessage('Miles must be a non-negative integer.'),

        // Color is required
        body('inv_color')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a color.'),

        // Optional: validate other fields such as description, image, thumbnail, etc.
    ];
};

// Middleware to check for errors in update data
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color } = req.body;
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);
        const itemName = `${inv_make} ${inv_model}`;

        res.render('./inventory/edit-inventory', {
            errors,
            title: 'Edit ' + itemName,
            nav,
            classificationSelect,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id: req.body.classification_id,
        });
        return;
    }
    next();
};


module.exports = validate;
