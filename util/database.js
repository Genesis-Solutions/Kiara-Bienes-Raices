//Aqui va la conexion a la base de datos

const { createPool } = require("mysql2");

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'ValarMelkor153*',
    port: 3306,
    database: 'kiara-dev',
});

module.exports = pool.promise();