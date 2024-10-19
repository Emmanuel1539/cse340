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
const static = require("./routes/static")
const baseController = require('./controllers/baseController')
const inventoryRoute = require('./routes/inventoryRoute')
const utilities = require('./utilities')
const causeError = require('./routes/errorRoute')


/* ***********************
 * Views Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at view root


/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes - Unit 3, activities
app.use('/inv', inventoryRoute)
// Error route (causing intentional 500 errors)
app.use('/causeError', causeError)



/* ***********************
 * 404 Error Middleware (file not found)
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})


  /*************************
 * General Error Handling Middleware (For all other routes)
 *************************/
  app.use(async (err, req, res, next) => {
  
    let nav = await utilities.getNav(); 
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);

    if(err.status == 404){message = err.message}
    else{ message = 'Oh no!, There was a crash. Maybe try a different route?'}
    res.render('errors/error'), {
      title: err.status || 'Server Error',
      message: err.message,
      nav
    };
  })


/* ***********************
 * Cause-error middleware (For specific custom 500 errors on /causeError)
 *************************/
app.use( async (err, req, res, next) => {
  if (err.status === 500) {
    try {
      let nav = await utilities.getNav(); // Ensure 'nav' is available for the view
      console.log('500 error middleware reached');
      res.status(500).render('errors/causeError', {
        title: '500 - Server Error',
        errorMessage: err.message,
        nav
      });
    } catch (error) {
      next(error); 
    }
  } else {
    next(err); }
});


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
