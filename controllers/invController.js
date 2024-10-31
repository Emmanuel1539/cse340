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
        res.render('inventory/management', {
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



// Render Add Inventory Form
invCont.buildAddInventoryView = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        const classificationSelect = await utilities.buildClassificationList();
        res.render("./inventory/add-inventory", {
            title: "Add New Inventory Item",
            nav,
            classificationSelect,
            errors: null
        });
    } catch (error) {
        console.error("Error rendering Add Inventory view:", error);
        next(error);
    }
};

// Handle Add Inventory Form Submission
invCont.addInventoryItem = async (req, res, next) => {
    try {
        const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
        const addResult = await invModel.addInventory({
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        });

        if (addResult) {
            req.flash("success", "Inventory item added successfully.");
            res.redirect("/inv/");
        } else {
            throw new Error("Failed to add inventory item.");
        }
    } catch (error) {
        console.error("Error adding inventory item:", error);
        let nav = await utilities.getNav();
        const classificationSelect = await utilities.buildClassificationList();
        res.render("inventory/add-inventory", {
            title: "Add New Inventory Item",
            nav,
            classificationSelect,
            errors: [{ msg: error.message }]
        });
    }
};



invCont.buildEditInventoryView = async (req, res, next) =>{
    
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()

    const itemData = await invModel.getInventoryItemById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/edit-inventory", {
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
}

// Update inventory data
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
  }


module.exports = invCont;