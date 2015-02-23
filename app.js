// load math.js
var math = require('mathjs');

// load express
var morgan  = require('morgan');
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var port    = process.env.PORT || 3000;
var router  = express.Router();

app.set('views', './views');
app.set('view engine', 'jade');

// Setup public folder, similar to sinatra (notice preceeding slash)
app.use(express.static(__dirname + '/public'));

// Middelware
app.use(morgan('dev'));

// Routes using Routing engine
router.get('/', function(req, res) {
  res.render('index');
});

// !important 
app.use('/', router);

server.listen(port);
console.log('Server started on ' + port);

// Integrate socket
var io = require('socket.io')(server);