const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
app.use(express.json());

const cookieParser = require('cookie-parser');
const session = require('express-session');
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
const rutasInmueble = require('./routes/inmueble.routes.js');;
const rutasSearchpage = require('./routes/searchpage.routes.js');

app.use('/inmueble', rutasInmueble)
app.use('/catalogo', rutasSearchpage); //Historia de usuario 2.7 - Ver lista de inmuebles
app.use('/', rutasHome);

//Historia de usuario 2.1 - Publicar inmueble 

//app.use("/public",express.static(dirname + '/public')); 
//app.use(express.static(path.join(dirname, 'public')));

// Puerto al que escucha 3000
app.listen(port, ()=>{
    //console.log("Server running on port", 3000)
});