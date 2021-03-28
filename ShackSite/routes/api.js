// Create constants for the required libraries
const express = require('express');

// Get the router from express
const router = express.Router();

// Connect to the database
const dbService = require("./../bin/connector.js");
const Poem = require('./../bin/poem');
const execFile = require('child_process').exec;
const fs = require('fs');
const Filter = require('bad-words');
const filter = new Filter({placeHolder: 'x', list: ['hitler', 'nipple', 'testicle']});

// ============================================
// REST API ENDPOINTS
// ============================================

// Get all poems
router.get('/poems', (request, response) => {
    // Get all poems from the database
    dbService.query("SELECT * FROM poems", (error, result) => {
        if (!error) {
            response.send(results);
        } else {
            console.log(error);
        }
    })
});

// Gets a specific poem
router.get('/poems/:id', (request, response) => {
    // Get all poems from the database
    dbService.query(`SELECT * FROM poems WHERE id='${request.params.id}'`, (error, result) => {
        if (!error) {
            var jsonString = result.json;
            var jsonObj = jsonString;
            jsonString = JSON.stringify(jsonObj);
            var textString = dbService.escape(result.poem);
            var out = { json: jsonString, text: textString };

            response.send(JSON.stringify(result));
        } else {
            console.log(error);
        }
    })
});

// Create a new poem
// router.get('/poems', (request, response) => {
//     response.send('Create')
// });

// Post a new poem
router.post('/poems', async (request, response) => {
    // Get the author and poem text
    const author = dbService.escape(request.body.author);
    const poemText = dbService.escape(request.body.poem);
    var poemGif = dbService.escape(request.body.gif);
    var poemOutput = await new Poem(poemText, author, poemGif);

    var cleanedAuthor = filter.clean(author);
    var cleanedPoem = filter.clean(poemText);

    var dir = __dirname + "/../bin";
    var command = "cd " + dir + "; dotnet analyzer.dll";
    execCommand(command, function(jsonoutput) {
        var out = dbService.escape(jsonoutput);
	var obj = JSON.parse(jsonoutput);
	var sentiment = dbService.escape(obj.sentiment.tag_name);
        dbService.query("INSERT INTO poems (poem, author, json, gif, sentiment) VALUES (" + cleanedPoem + ", " + cleanedAuthor + ", " + out +", " + poemGif + ", " + sentiment + ")", (error, result) => {
            if (!error) {
                response.redirect('/');
            } else {
                return console.log(error);
            }
        })
    });
});

function execCommand(cmd, callback) {
    execFile(cmd, (error, stdout, stderr) => {
        if(error) {
            return console.error('error in routes/api/execCommand');
        }

        var dataLocation = __dirname + "/../data/data.json";
        callback(fs.readFileSync(dataLocation));
    });
}


// Export the router
module.exports = router
