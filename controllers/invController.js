const invModel = require('../models/inventory-model')

const utilities = require('../utilities/index')

const invCont = {}

// Build inventory by classification view

invCont.buildByClassificationId = async function (req, res, next) {
    let classification_id = req.params.classificationId
    let data = await invModel.getInventoryByClassificationId(classification_id)
    let grid = await utilities.buildClassificationGrid(data)
    
    let nav = await utilities.getNav()
    let className = data[0].classification_name
    res.render('./inventory/classification',{
        title: className + ' vehicles',
        nav,
        grid,
    })

}

// Build vehicle details view by inventory id
invCont.buildByInventoryId = async function (req, res, next) {
    let inventoryId = req.params.inventoryId;
    try {
        let data = await invModel.getVehicleByInventoryId(inventoryId); 
        
        let gridHTML = utilities.buildVehicleDetailGrid(data); 
        let nav = await utilities.getNav();
        
        res.render('./inventory/detail', {
            title: `${data.inv_make} ${data.inv_model}`,
            nav,
            gridHTML,
        });
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        next(error);   }
};

invCont.buildManagementView = async function (req, res, next) {
    try{
        const managementHTML = utilities.buildManagementView()
        const nav = await utilities.getNav()
        res.render('./inventory/management', {
            title: 'Vehicle Management',
            nav, 
            managementHTML,
        })
    } catch(error){
        console.error('Error rendering management view', error)
        next()
    }
}

// Display the Add New Classification view
invCont.buildAddClassificationView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();
        // Pass an empty string for classification_name when rendering the view
        res.render('./inventory/add-classification', {
            title: "Add New Classification",
            nav,
            
            flashMessage: req.flash('notice'),
        });
    } catch (error) {
        console.error("Error rendering Add New Classification view:", error);
        next(error);
    }
};
// Display the Add New Inventory Item view
invCont.buildAddInventoryView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render('./inventory/add-inventory', {
            title: "Add New Inventory Item",
            nav,
            flashMessage: req.flash('notice'),
        })
    } catch (error) {
        console.error("Error rendering Add New Inventory Item view:", error)
        next(error)
    }
}

module.exports = invCont;