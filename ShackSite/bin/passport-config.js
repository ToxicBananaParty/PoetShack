const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { Console } = require('console');

// Connect to the database
const dbService = require("./connector.js");

function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        //console.log(user);
        if (user == null)
            return done(null, false, { message: 'Username does not exist!'})

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Username does not exist!'})
            }
        } catch (error) {
            return done(error)
        }
    }

    passport.use(new LocalStrategy( { usernameField: 'username', passwordField: 'password'},
    authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => done(null, await getUserByID(id)))
}

async function getUserByUsername(username) {
    //console.log("Looking for: " + username);
    return new Promise((resolve, reject) => {
        dbService.query('SELECT * FROM users WHERE username = ' + dbService.escape(username), (error, result) => {
            if (!error) {
                resolve(result[0])
            }
            else {
                console.log(error);
            }
        })
    })
}

async function getUserByID(id) {
    return new Promise((resolve, reject) => {
        dbService.query(`SELECT * FROM users WHERE id=${id}`, (error, result) => {
            if (!error) {
                resolve(result[0])
            }
        })
    })
}


module.exports = initialize;