const express = require('express')
const router = express.Router()
const profileModel = require('../models/profile-model')
const utilities = require('../utilities')
const profileCont = require('../controllers/profileController')
const proValidate = require('../utilities/profile-validation')


// Route to display profile view
router.get('/:account_id', 
    utilities.handleErrors(profileCont.buildProfileView)
)

router.get(
    '/edit-profile',
    proValidate.profileRules(),
    proValidate.checkProfileData,
    utilities.handleErrors(profileCont.showEditProfileView)
)

// Route to edit profile
router.post(
    '/edit-profile',
    proValidate.profileRules(),
    proValidate.checkProfileData,
    utilities.handleErrors(profileCont.editProfile)
)

// Route to create a new profile
router.post(
    '/create',
    proValidate.profileRules(),               
    proValidate.checkProfileData,            
    utilities.handleErrors(profileCont.addProfileData) 
);


module.exports = router;