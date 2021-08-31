const mysql = require("mysql");
const dbConfig = require("../config/db.config");

// Create a connection to the database
let connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
})

// Open the MySQL connection
connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

module.exports = connection;