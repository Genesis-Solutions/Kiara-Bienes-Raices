//Aqui va la conexion a la base de datos

const { createPool } = require("mysql2");

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'Azulpera3306',
    port: 3306,
    database: 'dev_kiara_4',
});

module.exports = pool.promise();