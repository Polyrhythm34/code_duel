var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var gameBrain = require('./models/game-brain');

var index = require('./routes/index');
var admin = require('./routes/admin');

var app = express();
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/admin', admin);

app.io.on('connection', function(socket) {
  
  
  app.io.to(socket.id).emit('receive user id', socket.id);
  console.log(socket.id + ' connected (' + gameBrain.userConnect(socket.id) + ')');
  app.io.emit('update users', gameBrain.getUsers());
  socket.on('have typed', function(msg, userid) {
    console.log('have typed: ' + msg);
    app.io.to(userid).emit('have typed message', msg);
  });
  socket.on('to type', function(msg, userid) {
    console.log('to type: ' + msg);
    app.io.to(userid).emit('to type message', msg);
  });
  socket.on('challenge', function(msg) {
    app.io.to(msg).emit('you have been challenged', socket.id);
  });
  socket.on('accept challenge', function(msg){
    gameBrain.randomScript().then((randomScript) => {
      app.io.to(socket.id).emit('sending script', randomScript);
      app.io.to(msg).emit('sending script', randomScript);
  }).then(() => {
      app.io.to(msg).emit('challenge accepted', socket.id);
      app.io.to(socket.id).emit('challenge accepted', msg);
    });
  });
  socket.on('denied challenge', function(msg){
    app.io.to(msg).emit('challenge denied', socket.id);
  });
  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected (' + gameBrain.userDisconnect(socket.id) + ')');
    app.io.emit('update users', gameBrain.getUsers());
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
