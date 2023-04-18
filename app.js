const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.json());

//Le decimos a node que nuestros assets se encuentran en assets
app.use(express.static(path.join(__dirname, 'assets')))
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const rutasHome = require('./routes/homepage.routes')
const rutasCRUD = require('./routes/crud.routes')

app.use('/crud', rutasCRUD);
app.use('/', rutasHome);

app.use("/public",express.static(__dirname + '/public')); 
//app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.render('error404');
});

// Puerto al que escucha 3000
app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`);
    //console.log(__dirname + '/assets')
});

