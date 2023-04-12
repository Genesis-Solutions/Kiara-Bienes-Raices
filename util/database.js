const mysql = require('mysql2');

const database = {
    host: 'localhost',
    user: 'root',
    database: 'crud-kiara',
    password: '',
};

const databaseInstancia = {
    host: 'localhost',
    user: 'root',
    database: 'crud',
    password: 'Kiara_b1en_esraices//q',
    port: 3306
};

const pool = mysql.createPool(database);

module.exports = pool.promise();