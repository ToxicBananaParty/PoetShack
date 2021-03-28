// Create constants for the required libraries
const express = require('express');

// Get the router from express
const router = express.Router();

// Connect to the database
const dbService = require("./../bin/connector.js");

// ============================================
// PAGES
// ============================================

// Page for creating a new poem
router.get('/new', (request, response) => {
    response.render('poems/new')
});

// Display information about all poems
router.get('/', (request, response) => {
    dbService.query("SELECT * FROM poems", (error, result) => {
        if (!error) {
            response.render('poems/poems', { poems: result})
        }
    })
});

// Post information about a poem
// NOTE: IS REDUNDANT WITH THE API! FIGURE OUT A WAY TO GET IT CONNECTED TO THE API??
router.post('/', (request, response) => {
    // Get the author and poem text
    const author = dbService.escape(request.body.author);
    const poemText = dbService.escape(request.body.poem);

    // Send the info to the database
    dbService.query(`INSERT INTO poems (poem, author) VALUES (${poemText}, ${author})`, (error, result) => {
        if (!error) {
            response.render('poems/new')
        } else {
            console.log(error);
        }
    })
});

// Display information about a specific poem
router.get('/:id', (request, response) => {
    // Get a specific poem from the database
    dbService.query(`SELECT * FROM poems WHERE id='${request.params.id}'`, (error, result) => {
        if (!error) {
            response.render('poems/poem', { poem: result })
        }
    })
});


// Export the router
module.exports = router