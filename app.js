// Watchify with browserify
var watchify = require('watchify');
var fromArgs = require('watchify/bin/args');
// watchify public/javascript/client.js -o public/javascript/bundle.js

// load server logging
var morgan  = require('morgan');

// load express 
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var port    = process.env.PORT || 3000;
var router  = express.Router();

// setup sass
var sassMiddleware = require('node-sass-middleware');

// Setup SASS directories
var path = require('path');

app.use(sassMiddleware({
    src: __dirname + '/scss', 
    dest: __dirname + '/public/stylesheets', 
    debug: true, 
    outputStyle: 'compressed' 
  }),
  // The static middleware must come after the sass middleware
  express.static(path.join(__dirname, 'public'))
)

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

