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

async function getInventoryItemById(inventoryId) {
    try {
        const query = 'SELECT * FROM inventory WHERE inv_id = $1'
        const result = await pool.query(query, [inventoryId])
        return result.rows[0]
    } catch (error) {
        console.error('Error retrieving inventory it by ID', error)
    }
}

module.exports = {getClassification, 
                getInventoryItemById,
                getInventoryByClassificationId, 
                getVehicleByInventoryId,
                insertClassification,
                checkExistingClassifiactionName};