const { json } = require('body-parser');
const invModel = require('../models/inventory-model');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Util = {}

// Construct the nav HTML unordered list
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassification();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';

    data.rows.forEach((row) => {
        list += "<li>";
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>";
        list += "</li>";
    });

    list += "</ul>"; // Closing the ul tag



    return list; // Return the list
};



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>' 
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  
// Build vehicle detail grid view
  Util.buildVehicleDetailGrid = function(data) {
    const price = `${Number(data.inv_price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
    const mileage = `${Number(data.inv_miles).toLocaleString('en-US')} miles`;

    const gridHTML = `
        <div class="vehicle-detail-container">
            <img src="${data.inv_image}" alt="Full image of ${data.inv_make} ${data.inv_model}">
            <div class="vehicle-info">
                <div class="vehicle-header">
                    <span>${data.inv_year} ${data.inv_make} ${data.inv_model} - ${price}</span>
                </div>
                <span class="mileage-price"><p>Mileage: ${mileage}</p> <p>Price: ${price}</p></span>
                <div class="detail-wrapper">
                    <div class="vehicle-detail-content">
                        <p>Price: ${price}</p>
                        <p>Mileage: ${mileage}</p>
                        <p>Color: ${data.inv_color}</p>
                        <p>Transmission: ${data.inv_transmission || 'N/A'}</p>
                        <p>Fuel Type: ${data.inv_fuel_type || 'N/A'}</p>
                    </div>
                    <div class="description">
                        <p>Description: ${data.inv_description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    return gridHTML;
};


// Existing function to build navigation
Util.getNav = async function () {
    let data = await invModel.getClassification();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';

    data.rows.forEach((row) => {
        list += "<li>";
        list +=
            `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
        list += "</li>";
    });

    list += "</ul>"; 
    return list;
};

/* **************************************
* Build the inventory management view HTML
* ************************************ */
Util.buildManagementView = function() {
    const managementHTML = `
        <div class="management-container">
            
            <div class="management-links">
                <a href="/inv/add-classification" class="btn btn-primary">Add New Classification</a>
                <br>
                <a href="/inv/add-inventory" class="btn btn-primary">Add New Inventory Item</a>
            </div>
        </div>
    `;
    return managementHTML;
}


//  Middleware to check token validity
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}


// Check login
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next()
    } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
   }


// Authorization Middleware to Check User Role
Util.authorizeAdminOrEmployee = (req, res, next) => {
    const accountData = res.locals.accountData;
   
    // Check if the accountData exists and userType is either Employee or Admin
    if (accountData && (accountData.account_type === 'Employee' || accountData.account_type === 'Admin')) {
        next();
          // Authorized
    } else {
        req.flash("error", "You do not have permission to access this resource.");
        res.redirect("/account/login");  // Redirect to login if not authorized
    }
};

// Build classification list 
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassification()
    let classificationList =
    '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (classification_id != null && row.classification_id == classification_id) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

Util.getAccountTool = async function (accountData) {
    let accountTool;
    
    if(accountData){
        const userName= accountData.account_firstname
     
        accountTool = `<a title="Click to Manage Account" href="/account/">Welcome ${userName} </a>`
        accountTool += `<a title="Click to Manage Profile" class="profile" href="/profile/${accountData.account_id}"> Profile </a>`
        accountTool += `<a title="Click to Logout" class="logout" href="/account/logout/">Logout</a>`
      }else{
        accountTool = `<a title="Click to log in" href="/account/">My Account</a>`
      }
     
      return accountTool
    }


    // Create profile grid view
   
//   Util.buildProfileView = function(data) {
    
//     const profileHTML = `
        
//         <div class="profile-detail-container">
//             <img src="${data.profile_image !== null ? data.profile_image  : ''}" alt="Full image of ${data.account_firstname}">
//             <div class="profile-info">
//                 <h2>${data.account_firstname} ${data.account_lastname}</h2>
//                 <h3>Brography</h3>
//                 <p>${data.profile_bio}</p>
//                 <h3>Social link</h3>
//                 <p>${data.profile_link}</p>
//             </div>
//             <a title="Click to Edit" href="/profile/edit-profile">Edit Profile</a>
//         </div>
//     `;

//     return profileHTML;
// };


  // Create profile grid view
   
  Util.buildProfileView = function(data) {
    console.log(data)
    
    const profileHTML = `
        
        <div class="profile-detail-container">
            <img src="${data && data.profile_image !== null ? data.profile_image  : ''}" alt="Full image of ${data && data.account_firstname != null ? data.account_firstname : ''}">
            <div class="profile-info">
                <h2>${data && data.account_firstname !== null ? data.account_firstname : ''} ${data && data.account_lastname !== null ? data.account_lastname : ''}</h2>
                <h3>Brography</h3>
                <p>${data && data.profile_bio != null ? data.profile_bio : ''}</p>
                <h3>Social link</h3>
                <p>${data && data.profile_links != null ? JSON.stringify(data.profile_links) : ''}</p>
            </div>
            <a title="Click to Edit" href="/profile/edit-profile">Edit Profile</a>
        </div>
    `;
    return profileHTML;
};
 

  
  /* ***********************
 * Middleware for handling errors
* Wrap other function in this for general error handling
 *************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);



module.exports = Util;