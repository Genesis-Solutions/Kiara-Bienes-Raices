const mysql = require('mysql2');

const database = {
    host: '127.0.0.1',
    user: 'root',
    database: 'crud',
    password: 'Kiara_b1en_esraices//q',
    port: 3306
};

const pool = mysql.createPool(database);

module.exports = pool.promise();