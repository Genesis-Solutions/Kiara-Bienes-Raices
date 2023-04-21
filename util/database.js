const mysql = require('mysql2');

const databaseLocal = {
    host: 'localhost',
    user: 'root',
    database: 'dev_kiara',
    password: 'Azulpera3306',
};

const databaseInstancia = {
    host: 'localhost',
    user: 'aldo',
    database: 'dev_kiara',
    password: 'Kiara_b1en_esraices//q',
    port: 3306
};

const pool = mysql.createPool(databaseLocal);

module.exports = pool.promise();