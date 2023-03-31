const mysql = require('mysql2');

const database = {
    host: 'localhost',
    user: 'root',
    database: 'crud-kiara',
    password: '',
};

const pool = mysql.createPool(database);

module.exports = pool.promise();