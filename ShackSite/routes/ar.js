// Create constants for the required libraries
const express = require('express');

// Get the router from express
const router = express.Router();

// ============================================
// PAGES
// ============================================

// Display the index page
router.get('/ar', (request, response) => {
    response.render('ar/ar-select', {layout: 'layouts/default-layout'});
});

router.get('/ar/:id', (request, response) => {
    var renderString = "ar/vid" + request.params.id;
    response.render(renderString, {layout: 'layouts/ar-layout'});
});

// Export the router
module.exports = router