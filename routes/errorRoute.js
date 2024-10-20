const express = require('express');
const router = express.Router();
const triggerErrorController = require('../controllers/errorController');

// Route to trigger internal error. 
router.get('/', triggerErrorController);


module.exports = router;