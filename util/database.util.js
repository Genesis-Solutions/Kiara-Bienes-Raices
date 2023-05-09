//Aqui va la conexion a la base de datos
const { createPool } = require('mysql2');

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'Pops11252001!',
    port: 3306,
    database: 'dev_kiara1.3'
})

module.exports = pool.promise();