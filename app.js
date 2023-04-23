const express = require('express');
const app = express();
const path = require('path');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: 'Prueba de Cookies', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

// Le decimos a node que nuestros assets se encuentran en assets
app.use(express.static(path.join(__dirname, 'assets')))
//app.use(express.static(path.join(__dirname, 'styles')))

app.set('view engine', 'ejs');
app.set('views', 'views');

const rutasHome = require('./routes/homepage.routes.js');
const rutasInmueble = require('./routes/inmueble.routes.js');

app.use('/', rutasHome);
app.use('/inmueble', rutasInmueble)

//app.use("/public",express.static(dirname + '/public')); 
//app.use(express.static(path.join(dirname, 'public')));

// Puerto al que escucha 3000
app.listen(3000, ()=>{
    //console.log("Server running on port", 3000)
});