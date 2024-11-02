const utilities = require('../utilities')
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
            .custom(async(account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if(emailExists){
                    throw new Error('Email exists. Please login or use different emaail.')
                }
            })
    ]
}


validate.checkRegData = async(req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []

    errors = validationResult(req)
    

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        const accountData = res.locals.accountData
        let accountTool = await utilities.getAccountTool(accountData)
       
        res.render('account/register', {
            errors,
            title: 'Registration',
            nav, 
            accountTool,
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
            .notEmpty()
            .escape()
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

validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = validationResult(req)
  

    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('account/login', {
            errors, // Format errors for display
            title: 'Login',
            nav,
            account_email, // Sticky input for email
        })
        return 
    
    } 
    next()
}

validate.getCurrentData = async (req, res, next) => {
    const {account_id} = req.body
    const currentId = parseInt(account_id)
    const accountData = await accountModel.getAccountById(currentId)
    req.currentUserData = accountData

    next()
    
}  

// Account update rules and check update data
validate.accountUpdateRules = () => {
    return [
        // First name: required, non-empty, and must be a string
        body('account_firstname')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a first name.'),

        // Last name: required, non-empty, and must be a string
        body('account_lastname')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a last name.'),

        // Email: required, valid email format, and must not already exist
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email is required.')
            .custom(async (account_email, { req }) => {
                const currentUserEmail = req.currentUserData.account_email
                if (account_email == currentUserEmail){
                    return true
                } 
                const emailExists = await accountModel.checkExistingEmail(account_email)

                if(emailExists){
                    throw new Error('Email already exists. Please use a different email.')
                }
            })
            
    ]
}



// Middleware to check validation result for the account update form
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const accountData = res.locals.accountData
        let accountTool = await utilities.getAccountTool(accountData)
       
        res.render('account/update', {
            errors,
            title: 'Update Account',
            nav,
            accountTool,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
        return
    }
    next()
}


// Password change validation rules
validate.changePasswordRules = () => {
    return [
        body('account_password')
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password must be at least 8 characters long and include uppercase letters, numbers, and special characters.')
    ]
}

// Middleware to check validation result for the password change form
validate.checkPasswordData = async (req, res, next) => {
    const { account_id } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const accountData = res.locals.accountData
        let accountTool = await utilities.getAccountTool(accountData)
       
        res.render('account/update', {
            errors,
            title: 'Change Password',
            nav,
            accountTool,
            account_id
        })
        return
    }
    next()
}




module.exports = validate