const express = require('express');
const path = require('path');
const app = express();

// Definiendo las rutas a usar
const home_routes = require('./routes/home_routes');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use('/', home_routes);

// Puerto al que escucha 3000
app.listen(3000, ()=>{
    console.log("Server running on port", 3000)
});

