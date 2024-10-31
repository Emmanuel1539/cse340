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

// inventory classification id 
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// Route to present edit form for a specific inventory item
// GET /inv/edit/:inventory_id
router.get('/edit/:inventory_id', utilities.handleErrors(invController.buildEditInventoryView))


// Route to update new inventory
router.post("/update/", 
        validate.newInventoryRules(), 
        validate.checkUpdateData,
        utilities.handleErrors(invController.updateInventory))
// Route to add new inventory item view

router.get('/add-inventory',  utilities.handleErrors(invController.buildAddInventoryView))

router.post('/add-inventory',
    validate.addInventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addInventoryItem)
)


// Route to add-classification 
router.post('/add-classification',
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification),
    
)

// Route to delete view
router.get('/delete/:inv_id', utilities.handleErrors(invController.addDeleteView))

// Route to delete item
router.post('/delete/:inv_id,', utilities.handleErrors(invController.deleteItem))

module.exports = router;