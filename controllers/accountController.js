// Deliver login
const utilities = require('../utilities')

// buiding login control
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()

    res.render('account/login', {
        title: "Login",
        nav,
    })
}

// build register
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()

    res.render('account/register',{
        title: "Register",
        nav,
            })
    
}

module.exports = {buildLogin, buildRegister}