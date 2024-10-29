const utilities = require('.')
const {body, validationResult} = require('express-validator')
const accountModel = require('../models/account-model')
const validate = {}


// Registration data validation rules
validate.registrationRules = () => {
    return[
        // firstname is required and must be string
        body('account_firstname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage('Please provide a first name.'),

        // lastname is required and must be string
        body('account_lastname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 2})
            .withMessage('Please provide a last name.'),

        // email is required and must be strong
        body('account_email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email is rquired.')
            .custom(async(account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if(emailExists){
                    throw new Error('Email exists. Please login or use different emaail.')
                }
            }),
        // password is required and must be strong password
        body('account_password')
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
    
            })
            .withMessage('Password does not meet requirements.')

    ]
}


validate.checkRegData = async(req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []

    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render('account/register', {
            errors,
            title: 'Registration',
            nav, 
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    
    next()
    
}

// login rule
validate.loginRules = () => {
    return [
        body('account_email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email is required.'),
        
        body('account_password')
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password does not meet requirements.')
    ]
}

validate.validateLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('account/login', {
            errors: errors.array(), // Format errors for display
            title: 'Login',
            nav,
            account_email, // Sticky input for email
        })
        return
    }
    next()
}

module.exports = validate