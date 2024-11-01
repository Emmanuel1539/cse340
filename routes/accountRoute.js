const express = require('express')
const router = express.Router()
const utilities = require('../utilities/')
const regValidate = require('../utilities/account-validation')
const accountController = require('../controllers/accountController')
const validate = require('../utilities/addInventory-validation')

// Route to build login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Route to build regeration view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

router.get(
    '/', 
    utilities.checkJWTToken,
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildAccountManagement) 
)

// Route to post form 
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Route to login 
router.post(
    "/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)


// Route to deliver the account update view
router.get(
    '/update/:account_id',
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountUpdateView)
)

// Route to process the account update
router.post(
    '/update',
    utilities.checkJWTToken, 
    regValidate.accountUpdateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.processAccountUpdate)
)

// Route to process password change
router.post(
    '/change-password',
    utilities.checkJWTToken, 
    regValidate.changePasswordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.processPasswordChange)

)

router.get(
    '/logout', 
    accountController.logout);

module.exports = router;