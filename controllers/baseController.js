const utilities = require("../utilities/index")
const baseController = {};

baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNav()
    
    const accountData = res.locals.accountData
    let accountTool = await utilities.getAccountTool(accountData)
   
    res.render("index", {title: "Home", nav, accountTool})
    
}

module.exports = baseController;