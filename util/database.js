//Aqui va la conexion a la base de datos
const mysql = require('mysql2');

const database = {
    host: 'localhost',
    user: 'root',
    database: 'dev_kiara',
    password: 'Azulpera3306',
    port: 3306
};


const pool = mysql.createPool(database);

module.exports = pool.promise();