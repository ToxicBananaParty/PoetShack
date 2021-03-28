// Create constants for the required libraries
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Get the router from express
const router = express.Router();

// Connect to the database
const dbService = require("./../bin/connector.js");
const { request } = require('express');

// ============================================
// PAGES
// ============================================

// Display the index page
router.get('/', (request, response) => {
    if (request.session.existingUser === undefined) {
        request.session.existingUser = true;
        response.render('intro');
    } else if (request.session.existingUser) {
        dbService.query("SELECT * FROM poems ORDER BY id DESC", (error, result) => {
            if (!error) {
                response.render('index', { poems: result })
            }
        })
    }
  
});


//Go to new poem page
router.get('/add', (request, response) => {
    response.render('poems/new')
});

// Display Ar page
router.get('/ar', (request, response) => {
    response.render('ar/ar-select', {layout: 'layouts/default-ar-layout'});
});

router.get('/ar/:id', (request, response) => {
    if(request.params.id <= 0 || request.params.id == null) {
        response.render('ar/ar-select', {layout: 'layouts/default-layout'});
        return;
    }

    var renderString = "ar/vid" + request.params.id;
    response.render(renderString, {layout: 'layouts/ar-layout'});
});

//add something that changes it when client is not ios
router.get('/info', (request, response) => {
    response.render('info/info', {layout: 'layouts/default-layout'})
});
router.get('/about', (request, response) => {
    response.render('info/about', {layout: 'layouts/default-layout'})
});
router.get('/shack', (request, response) => {
    response.render('info/shack', {layout: 'layouts/default-layout'})
});
router.get('/social', (request, response) => {
    response.render('info/social', {layout: 'layouts/default-layout'})
});

// Export the router
module.exports = router