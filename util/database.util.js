//Aqui va la conexion a la base de datos

const { createPool } = require("mysql2");

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_PROD,
});

module.exports = pool.promise();

