const invModel = require('../models/inventory-model');
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



  
  /* ***********************
 * Middleware for handling errors
* Wrap other function in this for general error handling
 *************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);



module.exports = Util;