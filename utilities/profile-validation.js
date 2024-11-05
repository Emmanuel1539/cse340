const { body, validationResult } = require('express-validator');
const utilities = require('../utilities'); // Adjust the path as necessary
const validate = {};

// Profile data validation rules
validate.profileRules = () => {
    return [
        // Profile image URL validation
        body('profile_image')
            .trim()
            .notEmpty()
            .withMessage('Profile picture URL is required.')
            
            .withMessage('Please provide a valid URL for the profile picture.'),
        
        // Biography validation
        body('profile_bio')
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('Biography must be between 10 and 500 characters long.'),
        
        // Social links validation
        body('profile_links')
            .optional()
            .custom(value => {
                if (value) {
                    try {
                        JSON.parse(value);
                        return true;
                    } catch (err) {
                        throw new Error('Social links must be a valid JSON format.');
                    }
                }
                return true; // Allow empty value
            })
    ];
};

// Middleware to check for validation errors
validate.checkProfileData = async (req, res, next) => {
    const { profile_image, profile_bio, profile_links } = req.body;
    const errors = validationResult(req);

    // If there are validation errors, render the form with error messages
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const accountData = res.locals.accountData;
        let accountTool = await utilities.getAccountTool(accountData);

        res.render('profile/create-profile', {  // Change the view to the appropriate template
            errors: errors.array(),
            title: 'Create Profile',
            nav,
            accountTool,
            profile: { profile_image, profile_bio, profile_links }
        });
        return;
    }

    // No validation errors, proceed to the next middleware
    next();
};



// Edit Profile data validation rules
validate.editProfileRules = () => {
    return [
        // Profile image URL validation
        body('profile_image')
            .trim()
            .notEmpty()
            .withMessage('Profile picture URL is required.')
            
            .withMessage('Please provide a valid URL for the profile picture.'),
        
        // Biography validation
        body('profile_bio')
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('Biography must be between 10 and 500 characters long.'),
        
        // Social links validation
        body('profile_links')
            .optional()
            .custom(value => {
                if (value) {
                    try {
                        JSON.parse(value);
                        return true;
                    } catch (err) {
                        throw new Error('Social links must be a valid JSON format.');
                    }
                }
                return true; // Allow empty value
            })
    ];
};

// Middleware to check for validation errors in Edit Profile
validate.checkEditProfileData = async (req, res, next) => {
    const { profile_image, profile_bio, profile_links } = req.body;
    const errors = validationResult(req);

    // If there are validation errors, render the edit profile form with error messages
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const accountData = res.locals.accountData;
        let accountTool = await utilities.getAccountTool(accountData);

        res.render('profile/edit-profile', {  
            errors: errors.array(),
            title: 'Edit Profile',
            nav,
            accountTool,
            profile: { profile_image, profile_bio, profile_links }
        });
        return;
    }

    next();
};

module.exports = validate;




