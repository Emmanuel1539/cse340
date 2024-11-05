const pool = require('../database');

// Get a customer profile by id
async function getProfileByAccountId(account_id) {
    try {
        const query = `
            SELECT profile.account_id, profile.profile_image, profile.profile_bio, profile.profile_links,
                   account.account_id, account.account_firstname, account.account_lastname
            FROM profile
            JOIN account ON profile.account_id = account.account_id
            WHERE profile.account_id = $1;
        `;
        const result = await pool.query(query, [account_id]);
      
        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving data from database', error);
        throw error;
    }
}


// Create a new customer profile
async function createProfile(account_id, profile_image, profile_bio, profile_links) {
    try {
        const query = `
            INSERT INTO profile (account_id, profile_image, profile_bio, profile_links)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [account_id, profile_image, profile_bio, profile_links];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error inserting data to the database', error);
        throw error; // It's good practice to throw the error for further handling
    }
}


async function updateProfile(account_id, profile_image, profile_bio, profile_links) {
    try {
        const query = `
    UPDATE profile
    SET profile_image = $1, profile_bio = $2, profile_links = $3
    WHERE account_id = $4
    RETURNING *
    `
    const values = [profile_image, profile_bio, profile_links, account_id]
    
    const result = await pool.query(query, values)
    console.log(result)
    return result.rows[0]
    
    } catch (error) {
        console.error('Error updating profile in the database:', error); 
    }
}


module.exports = {
                    getProfileByAccountId,
                    createProfile,
                    updateProfile,
}