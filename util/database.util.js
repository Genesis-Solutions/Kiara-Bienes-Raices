//Aqui va la conexion a la base de datos
const { createPool } = require('mysql2');

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: '',
});

module.exports = pool.promise();