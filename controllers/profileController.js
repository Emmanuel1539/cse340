const { json } = require('body-parser')
const profileModel = require('../models/profile-model')

const utilities = require('../utilities/index')

const profileCont = {}

// Build profile view
profileCont.buildProfileView = async function(req, res, next) {

    const accountId = req.params.account_id

    try {
      const profileData = await profileModel.getProfileByAccountId(accountId)
      const profileHTML = utilities.buildProfileView(profileData)
        const nav = await utilities.getNav()
  
        const accountData = res.locals.accountData
        let accountTool = await utilities.getAccountTool(accountData)

     
      

      res.render('./profile/index', {
        title: 'Profile Details', 
        nav,
        accountTool,
        profileHTML,
        errors: null,
      })
      

    } catch (error) {
        console.log('Error fetching profile details', error)
        next()
    }
}

// create profile data
profileCont.addProfileData = async function (req, res, next) {
   const account_id = res.locals.accountData.account_id
  try {
    
    const {profile_image, profile_bio, profile_links} = req.body;

    const addResult = await profileModel.createProfile(account_id, profile_image, profile_bio, profile_links)

  if(addResult){
    req.flash ('notice, Profile successfully added')
    res.render(`/profile/${account_id}`)
  } else{
    throw new Error('Unable to add profile data')
  }
  } catch (error) {
    console.log('Error adding data to the database', error)
    res.status(500).send('Error retrieving profile')

  }
}


profileCont.editProfile = async (req, res) => {
  try {
      const nav = await utilities.getNav();
      const { profile_image, profile_bio, profile_links } = req.body;
      const account_id = req.body.account_id;

      // Parse the JSON string for social links safely
      let socialLinks;
      try {
          socialLinks = JSON.parse(profile_links);
      } catch (err) {
          req.flash('error', 'Invalid JSON format for social links.');
          return res.render('profile/edit-profile', {
              title: 'Update Profile',
              nav,
              profile_image,
              profile_bio,
              profile_links,
              errors: [{ msg: 'Social links must be a valid JSON format.' }],
          });
      }

      // Update the profile
      const profile = await profileModel.updateProfile(
          account_id,  
          profile_image,
          profile_bio,
          socialLinks 
      );

      if (profile) {
          req.flash('notice', 'Your profile has been successfully updated.');
          res.redirect(`/profile/${account_id}`); 
      } else {
          req.flash('notice', 'Sorry, the update failed.');
          res.render('profile/edit-profile', { // Corrected path to render
              title: 'Update Profile',
              nav,
              
              profile_image,
              profile_bio,
              profile_links,
              errors: null,
          });
      }
      
  } catch (error) {
      console.error('Error updating profile:', error);
      req.flash('error', 'An error occurred while updating your profile.');
      res.status(500).send('Error updating profile');
  }
};



profileCont.showEditProfileView = async (req, res, next) =>{
    
  const inv_id = req.body.account_id
 
  const accountData = res.locals.accountData
  let accountTool = await utilities.getAccountTool(accountData)
  let nav = await utilities.getNav()

  const itemData = await proModel.getProfileByAccountId(account_id)
  const itemName = `${accountData.account_firstname} ${accountData.account_lastname}`
  res.render("profile/edit-profile", {
  title: "Edit " + itemName + "'s Profile",
  nav,
  accountTool,
  errors: null,
  account_id: itemData.account_id,
  profile_image: itemData.profile_image,
  profile_bio: itemData.profile_bio,
  profile_links: itemData.profile_links,
})
}



module.exports = profileCont