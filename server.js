/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const bodyParser = require('body-parser')


const static = require("./routes/static")
const baseController = require('./controllers/baseController')
// inventory routes - unit 3 activies
const inventoryRoute = require('./routes/inventoryRoute')
// Account route
const accountRoute = require('./routes/accountRoute')

const utilities = require('./utilities/')
const causeError = require('./routes/errorRoute')
const session = require('express-session')
const pool = require('./database/')
const cookieParser = require('cookie-parser')

/* ***********************
 * Views Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at view root

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret:process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// account middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// cookie parser
app.use(cookieParser())

// Express messages middlewares
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// JWT Token middleware
app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/

app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes - Unit 3, activities
app.use('/inv', inventoryRoute)
//  Account route
app.use('/account', accountRoute)
// Error route (causing intentional 500 errors)
app.use('/causeError', causeError)


/* ***********************
 * 404 Error Middleware (file not found)
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

// /* ***********************
//  * General Error Handling Middleware (For all other routes)
//  *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?"
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})