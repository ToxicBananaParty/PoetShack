// Create constants for the required libraries
const express = require('express');

// Get the router from express
const router = express.Router();

// Connect to the database
const dbService = require("./../bin/connector.js");

// ============================================
// PAGES
// ============================================

// Display information about all poems
router.get('/', (request, response) => {
    dbService.query("SELECT * FROM users", (error, result) => {
        if (!error) {
            response.render('users/users', { users: result, login: request.isAuthenticated() })
        }
    })
});

// Display information about a specific user
router.get('/:username', (request, response) => {
    // Get a specific poem from the database
    dbService.query(`SELECT * FROM users WHERE username=${dbService.escape(request.params.username)}`, (error, result) => {
        if (!error) {
            response.render('users/user', { user: result, login: request.isAuthenticated() })
        }
    })
});


// Export the router
module.exports = router