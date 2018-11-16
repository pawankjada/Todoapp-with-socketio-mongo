const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const http = require('http').Server(app);
const io = require('socket.io')(http);


const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

// Routes
// -----------------mongodb://<dbuser>:<dbpassword>@ds121203.mlab.com:21203/heroku_2z7j0jbv
mongoose.connect("mongodb://username@password.mlab.com:21203/heroku_2z7j0jbv", { useNewUrlParser: true });
// mongoose.connect('mongodb://localhost:27017/tododb')
require('./routes/api-routes.js')(app, io);
require('./routes/html-routes.js')(app);

// Starts our server on the predefined PORT
http.listen(PORT, function(){
})