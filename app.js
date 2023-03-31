const express = require('express');
const app = express();
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

const rutasHome = require('./routes/home_routes.js')

app.use("/public",express.static(__dirname + '/public')); 

app.use('/', rutasHome);

// Puerto al que escucha 3000
app.listen(3000, ()=>{
    console.log("Server running on port", 3000)
});

