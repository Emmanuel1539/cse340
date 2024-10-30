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
        const classificationSelect = await utilities.buildClassificationList()
        const nav = await utilities.getNav()
        res.render('./inventory/management', {
            title: 'Vehicle Management',
            nav, 
            errors: null,
            classificationSelect,
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
            errors: null,
           
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
invCont.addClassification = async function (req, res, next) {
    const {classification_name} = req.body;
    try {
        console.log(classification_name)
        const result = await invModel.insertClassification(classification_name);
        
        if(result){
            req.flash('notice', 'Classification added successfully');
        
            const nav = await utilities.getNav();
            res.render('./inventory/add-classification', {
                title: 'Add classification',
                nav,
                errors: null,
            })
        } else{
            req.flash('notice', 'Could not add classification');
            redirect('/inv/add-classification')
        }
    } catch (error) {
        console.error('Error adding classification', error)
        req.flash('notice', 'An unexpected error occured');
        redirect('/inv/add-classification')
    }
}

// Return inventory by classification as JSON
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }

invCont.buildEditInventoryView = async (req, res, next) =>{
    
    const inventoryId = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()

    const inventoryItem = await invModel.getInventoryItemById(inventoryId)
    const classificationSelect = await utilities.buildClassificationList(inventoryItem)
    
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
  next()
}

module.exports = invCont;