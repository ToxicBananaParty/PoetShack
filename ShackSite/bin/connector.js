const mysql = require("mysql")

// Create a connection variable
let connection = mysql.createConnection({
    host: "ls-5c28972521bc3fbc12e3aa4099765206229cc6e2.cqbldgemyejd.us-east-1.rds.amazonaws.com",
    database: "poetshack",
    user: "dbmasteruser",
    password: "temppass"
});

// Attempt to connect to the server
connection.connect(function(err) 
{
    if(err) {throw err;} 
});

function getUser(username, callback) {
    connection.query("SELECT * FROM users WHERE username=" + connection.escape(username), (error, user) => {
        if(error) {
            return console.log(error);
        }
        callback(user);
    });
}

function findPoemColumn(username, callback) {
    connection.query("SELECT * FROM users WHERE username=" + connection.escape(username), (error, user) => {
        if(error) {
            return console.log(error);
        }

        if(user[0].poem1 == null) {
            callback(1, user[0].id);
        }
        else if(user[0].poem2 == null) {
            callback(2, user[0].id);
        }
        else if(user[0].poem3 == null) {
            callback(3, user[0].id);
        }
        else if(user[0].poem4 == null) {
            callback(4, user[0].id);
        }
        else if(user[0].poem5 == null) {
            callback(5, user[0].id);
        }
        else {
            callback(6, user[0].id);
        }
    });
}

module.exports = connection;
module.exports.getUser = getUser;
module.exports.findPoemColumn = findPoemColumn;