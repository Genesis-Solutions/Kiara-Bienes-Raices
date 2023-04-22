const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
app.use(express.json());

// Le decimos a node que nuestros assets se encuentran en assets
app.use(express.static(path.join(__dirname, '/assets')))
app.use(express.static(path.join(__dirname, '/styles')))
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const rutasHome = require('./routes/homepage.routes.js');
const rutasSearchpage = require('./routes/searchpage.routes.js');

app.use('/catalogo', rutasSearchpage); //Historia de usuario 2.7 - Ver lista de inmuebles
app.use('/', rutasHome);

//app.use("/public",express.static(__dirname + '/public')); 
//app.use(express.static(path.join(__dirname, 'public')));

// Puerto al que escucha 3000
app.listen(port, ()=>{
    //console.log("Server running on port", 3000)
});