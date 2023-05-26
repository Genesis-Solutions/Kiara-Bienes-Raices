const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require("dotenv").config();

const app = express();

const port = process.env.PORT
app.set("port", port);

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: 'Prueba de Cookies', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

// Le decimos a node que nuestros assets se encuentran en assets
app.use(express.static(path.join(__dirname, '/assets')))
app.use(express.static(path.join(__dirname, '/styles')))
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const rutasHome = require('./routes/homepage.routes.js');
const rutasInmueble = require('./routes/inmueble.routes.js');
const rutasDashboard = require('./routes/dashboard.routes.js');
const rutasSearchpage = require('./routes/searchpage.routes.js');
const rutasUsuario = require('./routes/user.routes.js');

app.use('/inmueble', rutasInmueble)
app.use('/catalogo', rutasSearchpage);
app.use('/dashboard', rutasDashboard);
app.use('/perfil', rutasUsuario);
app.use('/', rutasHome);

//app.use("/public",express.static(dirname + '/public')); 
//app.use(express.static(path.join(dirname, 'public')));
//console.log("puerto: ", process.env.PORT)
app.listen(port, ()=>{
});

module.exports = app;