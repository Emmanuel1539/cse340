// resources needed

const express = require("express")
const router = new express.Router()
const invController = require('../controllers/invController')
const validate = require('../utilities/addInventory-validation');
const { route } = require("./accountRoute");
const utilities = require('../utilities')

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);
router.get('/detail/:inventoryId', invController.buildByInventoryId);

// Route to display inventory management view
router.get('/', invController.buildManagementView)

// Route to add new classification view
router.get('/add-classification', 
    invController.buildAddClassificationView)

// Route to add new inventory item view
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventoryView))

// Route to add-classification 
router.post('/add-classification',
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification),
    
)

module.exports = router;