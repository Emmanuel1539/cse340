const express = require('express');
const router = express.Router();
const triggerError = require('../controllers/errorController');

// Route to trigger internal error. 
router.get('/', triggerError);


module.exports = router;