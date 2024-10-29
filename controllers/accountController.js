// Deliver login
const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


// buiding login control
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()

    res.render('account/login', {
        title: "Login",
        nav,
        errors: null,
    })
}

// build register
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()

    res.render('account/register',{
        title: "Register",
        nav,
        errors: null,
            })
    
}

async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body

    // Hash the password before storing
    let hashedPassword
    try{
        // regular password and cost(salt is generated acutomatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error){
        req.flash(
            'notice',
            'Sorry, there was an error processing the registration.'

        )
    }

    const regResult = await accountModel.registerAccount(
        account_firstname, 
        account_lastname, 
        account_email, 
        hashedPassword
    )

    if(regResult){
        req.flash(
            "notice",
            `Congratulation, you\'re registered ${account_firstname}. Please log in.`

        )
        res.status(201).render('account/login',{
            title: "Login",
            nav,
            errors: null
        })
    } else{
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render('account/register', {
            title: "Registration",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        req.flash('notice', 'You are now logged in.')
        return res.redirect("/account/")
      }
      else {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
          account_password
        })
      }
    } catch (error) {
      throw new Error('Access Forbidden')
    }
  }

async function buildAccountManagement(req, res) {
    let nav = await utilities.getNav()
    // req.flash('notice')
    res.render('account/',{
        title: 'Account Management',
        nav,
        
        errors: null,
    })
}

module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement}