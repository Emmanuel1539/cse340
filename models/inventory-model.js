const pool = require('../database');

// Get all classification data
async function getClassification() {
    return await pool.query('SELECT * FROM public.classification ORDER BY classification_name')
}



// getting all inventory items and classification_name by classification_id
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1 `,[classification_id]
        )
        return data.rows
    } catch(error){
        console.error('classificationbyid error ' + error)
    }
    
}

// Get a specific vehicle by inventory id
async function getVehicleByInventoryId(inventory_id){
    try{
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`, [inventory_id]
        )
        return data.rows[0]  // to get a single row
    } catch (error){
        console.error('vehiclebyid error' + error)
    }
}

async function insertClassification(classification_name) {
   try {
    const query = 'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *'
    const result = await pool.query(query, [classification_name])
    return result
   } catch (error) {
    console.error('Inserting new classification' + error)
   }
}
async function checkExistingClassifiactionName(classification_name) {
   try {
    const query = 'SELECT * FROM classification WHERE classification_name = $1'
    const result = await pool.query(query, [classification_name])
    return result.rowCount
   } catch (error) {
    return error.message
   } 
}

async function getInventoryItemById(inv_id) {
    try {
        const query = 'SELECT * FROM inventory WHERE inv_id = $1'
        const result = await pool.query(query, [inv_id])
        return result.rows[0]
    } catch (error) {
        console.error('Error retrieving inventory by ID', error)
    }
}




// Insert a new inventory item
async function addInventory({
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
}) {
    try {
        const query = `
            INSERT INTO public.inventory 
            (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const values = [
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
        ];

        const result = await pool.query(query, values);
        return result.rows[0]; // Return the newly added item
    } catch (error) {
        console.error('Error adding inventory item:', error);
        throw error;
    }
}

async function insertClassification(classification_name) {
    try {
        const query = 'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';
        const result = await pool.query(query, [classification_name]);
        return result;
    } catch (error) {
        console.error('Inserting new classification: ' + error);
    }
}



async function updateInventory(
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
  ) {
    try {
      const sql =
        "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
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
        inv_id
      ])
      return data.rows[0]
    } catch (error) {
      console.error("model error: " + error)
    }
  }

  async function deleteInventoryItem(inv_id) {
    try{
        const query = 'DELETE FROM inventory WHERE inv_id = $1'
        const data = await pool.query(query, [inv_id])
        return data
    } catch(error){
        new Error ('Delete Inventory Error')
    }
  }
module.exports = {getClassification, 
                updateInventory,
                getInventoryItemById,
                getInventoryByClassificationId, 
                getVehicleByInventoryId,
                insertClassification,
                checkExistingClassifiactionName,
                addInventory,
                insertClassification,
                deleteInventoryItem};