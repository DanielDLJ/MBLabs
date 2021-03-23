const mysql = require('mysql')

var client = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: 'test'
    //password: "mypassword"
});

client.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DataBase!");
});

module.exports = client