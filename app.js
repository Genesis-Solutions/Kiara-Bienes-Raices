const express = require('express');
const app = express();
const path = require('path');

// Le decimos a node que nuestros assets se encuentran en assets
app.use(express.static(__dirname + '/assets')); 

app.set('view engine', 'ejs');
app.set('views', 'views');

const rutasHome = require('./routes/home_routes.js')

app.use('/', rutasHome);

//app.use("/public",express.static(__dirname + '/public')); 
//app.use(express.static(path.join(__dirname, 'public')));

// Puerto al que escucha 3000
app.listen(3000, ()=>{
    console.log("Server running on port", 3000)
    console.log(__dirname + '/assets')
});
