const { json } = require('body-parser')
const profileModel = require('../models/profile-model')

const utilities = require('../utilities/index')

const profileCont = {}

// Build profile view
profileCont.buildProfileView = async function (req, res, next) {
  const accountId = req.params.account_id

  try {
    const profileData = await profileModel.getProfileByAccountId(accountId)
    console.log(profileData)
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

    const { profile_image, profile_bio, profile_links } = req.body;

    const addResult = await profileModel.createProfile(account_id, profile_image, profile_bio, profile_links)

    if (addResult) {
      req.flash('notice, Profile successfully added')
      res.redirect(`/profile/${account_id}`)
    } else {
      throw new Error('Unable to add profile data')
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    req.flash('error', 'An error occurred while updating your profile.');
    res.redirect(`/profile/${account_id}`);
  }
}


profileCont.editProfile = async (req, res) => {
  try {
    const nav = await utilities.getNav();
    const { profile_image, profile_bio, profile_links } = req.body;
    const account_id = req.body.account_id;

    const accountData = res.locals.accountData
    let accountTool = await utilities.getAccountTool(accountData)

    // Parse the JSON string for social links safely
    let socialLinks;
    try {
      socialLinks = JSON.parse(profile_links);
    } catch (err) {
      req.flash('error', 'Invalid JSON format for social links.');
      return res.render('profile/edit-profile', {
        title: 'Update Profile',
        nav,
        accountTool,
        account_id,
        profile_image,
        profile_bio,
        profile_links,
        errors: [{ msg: 'Social links must be a valid JSON format.' }],
      });
    }

    const itemData = await profileModel.getProfileByAccountId(accountData.account_id);
    let profile = null;
    if (itemData != null) {
      // Update the profile
      console.log(account_id)
      console.log(profile_image)
      console.log(profile_bio)
      console.log(socialLinks)
      profile = await profileModel.updateProfile(
        account_id,
        profile_image,
        profile_bio,
        socialLinks
      );
    } else {
      profile = await profileModel.createProfile(
        account_id, 
        profile_image, 
        profile_bio, 
        socialLinks
      );
    }

    if (profile) {
      req.flash('notice', 'Your profile has been successfully updated.');
      res.redirect(`/profile/${account_id}`);
    } else {
      req.flash('notice', 'Sorry, the update failed.');
      res.render('profile/edit-profile', { // Corrected path to render
        title: 'Update Profile',
        nav,
        accountTool,
        account_id,
        profile_image,
        profile_bio,
        profile_links,
        errors: null,
      });
    }

  } catch (error) {
    console.error('Error updating profile:', error);
    req.flash('error', 'An error occurred while updating your profile.');
    res.redirect(`/profile/${account_id}`);
  }
};





profileCont.showEditProfileView = async (req, res, next) => {
  const accountData = res.locals.accountData
  let accountTool = await utilities.getAccountTool(accountData)
  let nav = await utilities.getNav()

  const itemData = await profileModel.getProfileByAccountId(accountData.account_id)
  const itemName = `${accountData.account_firstname} ${accountData.account_lastname}`
  res.render("profile/edit-profile", {
    title: "Edit " + itemName + "'s Profile",
    nav,
    accountTool,
    errors: null,
    account_id: accountData.account_id,
    profile_image: (itemData != null) ? itemData.profile_image : '',
    profile_bio: (itemData != null) ? itemData.profile_bio : '',
    profile_links: (itemData != null) ? itemData.profile_links : '{}',
  })
}

module.exports = profileCont