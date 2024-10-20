const express = require('express')
const router = express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')

// Route to build login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Route to build regeration view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

module.exports = router;