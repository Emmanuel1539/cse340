const express = require('express')
const router = express.Router()
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')
const accountController = require('../controllers/accountController')

// Route to build login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Route to build regeration view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Route to post form 
router.post(
    '/register',
    regValidate.registrationRules,
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))


module.exports = router;