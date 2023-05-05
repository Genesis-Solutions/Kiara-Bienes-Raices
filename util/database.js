//Aqui va la conexion a la base de datos

const { createPool } = require("mysql2");

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'env-77-QSD23',
    port: 3306,
    database: 'dev_kiara',
});

module.exports = pool.promise();
