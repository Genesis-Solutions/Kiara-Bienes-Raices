//Aqui va la conexion a la base de datos

const { createPool } = require("mysql2");

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'Canela99@',
    port: 3306,
    database: 'dev-kiara',
});

module.exports = pool.promise();