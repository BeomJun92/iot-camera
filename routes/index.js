var express = require('express');
var router = express.Router();



var cleanData = '';
var readData = '';
var arduino_data;

var power = 2;
var led1 = 2;
var led2 = 2;
var led3 = 2;
var send = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Jun Home Controller' });
});

router.get('/poweron', function(req, res) {
  res.send({success: 'true'});
  power = 1;
  send = true;
  console.log("powerON!"+power);
});

router.get('/poweroff', function(req, res) {
  res.send({success: 'true'});
  power = 0;
  send = true;
  console.log("poweroff!"+power);
});

router.get('/led1on', function(req, res) {
  res.send({success: 'true'});
  led1 = 1;
  send = true;
  console.log("led1ON!"+led1);
});

router.get('/led1off', function(req, res) {
  res.send({success: 'true'});
  led1 = 0;
  send = true;
  console.log("led1off!"+led1);
});

router.get('/led2on', function(req, res) {
  res.send({success: 'true'});
  led2 = 1;
  send = true;
  console.log("led2ON!"+led2);
});

router.get('/led2off', function(req, res) {
  res.send({success: 'true'});
  led2 = 0;
  send = true;
  console.log("led2off!"+led2);
});

router.get('/led3on', function(req, res) {
  res.send({success: 'true'});
  led3 = 1;
  send = true;
  console.log("led3ON!"+led3);
});

router.get('/led3off', function(req, res) {
  res.send({success: 'true'});
  led3 = 0;
  send = true;
  console.log("led3off!"+led3);
});

router.get('/arduinodata', function(req, res) {
  res.send({temperature: arduino_data[0], humidity: arduino_data[1], illuminity: arduino_data[2], obstacle: arduino_data[3]});
  console.log("arduinodata send");
});



// for arduino
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/cu.usbmodem1411", {
  baudrate: 9600
});






serialPort.on("open", function () {
  console.log('open');

  serialPort.on('data', function(data) {
    readData += data.toString();
    if(readData.indexOf('!') >= 0 && readData.indexOf('$') >= 0){
      cleanData = readData.substring(readData.indexOf('!')+1, readData.indexOf('$') );
      arduino_data = cleanData.split(":");
        // console.log(arduino_data);
      controlArduino();
      readData = '';
    }
    if(send){
	    if(power == 1){
		    serialPort.write("1", function(err, results) {
		      power = 2;
		    });
		  }

		  if(power == 0){
		    serialPort.write("2", function(err, results) {
		      power = 2;
		    });
		  }

		  if(led1 == 1){
		    serialPort.write("3", function(err, results) {
		      led1 = 2;
		    });
		  }

		  if(led1 == 0){
		    serialPort.write("4", function(err, results) {
		      led1 = 2;
		    });
		  }

		  if(led2 == 1){
		    serialPort.write("5", function(err, results) {
		      led2 = 2;
		    });
		  }

		  if(led2 == 0){
		    serialPort.write("6", function(err, results) {
		      led2 = 2;
		    });
		  }

		  if(led3 == 1){
		    serialPort.write("7", function(err, results) {
		      led3 = 2;
		    });
		  }

		  if(led3 == 0){
		    serialPort.write("8", function(err, results) {
		      led3 = 2;
		    });
		  }
		  send = false;
		}
	});
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


module.exports = router;
