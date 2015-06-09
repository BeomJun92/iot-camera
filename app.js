var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//for cam

var WebSocketServer = require("ws").Server;
var cam = require("../build/Release/camera.node");
var fs = require("fs");
var websocketPort = 9090,
    webPort = 3000,
    openBrowser = false,
    width = 640,
    height = 360;

var wss = new WebSocketServer({
    port: websocketPort
});

var clients = {};

var frameCallback = function (image) {
    var frame = {
        type: "frame",
        frame: new Buffer(image, "ascii").toString("base64")
    };
    var raw = JSON.stringify(frame);
    for (var index in clients) {
        clients[index].send(raw);
    }
};

var disconnectClient = function (index) {
    delete clients[index];
    if (Object.keys(clients).length == 0) {
        console.log("No Clients, Closing Camera");
        cam.Close();
    }
};

var connectClient = function (ws) {
    var index = "" + new Date().getTime();
    console.log(cam.IsOpen());
    if (!cam.IsOpen()) {
        console.log("New Clients, Opening Camera");
        cam.Open(frameCallback, {
            width: width,
            height: height,
            window: false,
            codec: ".jpg"
        });
    }
    clients[index] = ws;
    return index;
};

wss.on('connection', function (ws) {
    var disconnected = false;
    var index = connectClient(ws);

    ws.on('close', function () {
        disconnectClient(index);
    });

    ws.on('open', function () {
        console.log("Opened");
    });

    ws.on('message', function (message) {

        switch (message) {
        case "close":
            {
                disconnectClient(index);
            }
            break;
        case "size":
            {
                var size = cam.GetPreviewSize();

                ws.send(JSON.stringify({
                    type: "size",
                    width: size.width,
                    height: size.height
                }));
            }
            break;
        }
    });

});

// for cam


// for arduino
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/cu.usbmodem1411", {
  baudrate: 9600
});


var cleanData = '';
var readData = '';
var arduino_data;

serialPort.on("open", function () {
  console.log('open');

  serialPort.on('data', function(data) {
    readData += data.toString();
    if(readData.indexOf('!') >= 0 && readData.indexOf('$') >= 0){
      cleanData = readData.substring(readData.indexOf('!')+1, readData.indexOf('$') );
      arduino_data = cleanData.split(":");
      console.log(arduino_data);
      controlArduino();
      readData = '';
    }
  });
  
  setInterval(function() {
    serialPort.write("1", function(err, results) {
    });
  }, 3000);
});

function controlArduino(){
  if(arduino_data[3]=="0"){
    sendmail();
  }
}

var nodemailer = require('nodemailer');
  // create reusable transporter object using SMTP transport
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'serr92b@gmail.com',
          pass: 'qjawns45'
      }
  });

function sendmail(){
  // NB! No need to recreate the transporter object. You can use
  // the same transporter object for all e-mails

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'Javis <jun@javis.com>', // sender address
      to: 'serr92b@gmail.com', // list of receivers
      subject: 'Home Warning!', // Subject line
      text: 'Some one is entering your home!', // plaintext body
      html: '<b>Some one is entering your home!</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);

  });
}


module.exports = app;
