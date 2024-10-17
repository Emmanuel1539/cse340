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


module.exports = invCont;