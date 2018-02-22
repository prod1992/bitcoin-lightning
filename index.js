(function () {
  
  'use strict';
  
  var userData = {
    username: '',
    email: '',
    phone: '',
    message: ''
  };
    var validForm = false;
  
  var express = require('express');
  var proxyMiddleware = require('http-proxy-middleware');
  var conf = require('./gulp/conf');
  var compression = require('compression');
  var nodemailer = require('nodemailer');
  var bodyParser = require('body-parser');
  var proxyOptions = {
    target: 'https://masternodes.online/currencies/BLT',
    changeOrigin: true
    // logLevel: 'debug',
    // onProxyReq: function (proxyReq, req, res) {
    //
    // }
  };
  
  
  var app = express();
  
  app.use(compression());
  
  app.use(express.static(conf.paths.dist));
  
  app.use('/api', proxyMiddleware(proxyOptions));
  
  app.get('/', function(req, res, next) {
    res.send('index.html', {root: conf.paths.dist});
    next();
  });
  
  app.listen(8080);
  
  //FORM PARAMS
  app.use(bodyParser());
  
  app.post('/', function(request, response){
    var takeInfo = request.body.user;
    userData.username = takeInfo.name;
    userData.email = takeInfo.email;
    userData.phone = takeInfo.phone;
    userData.message = takeInfo.message;
    var phoneCheck = /^\d{10}$/;
    function validate(){
      //email
      if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(userData.email))
      {
        return true;
      }
      //username
      if (userData.username !== null && userData.username !== "") {
        return true;
      }
      //phone
      if (userData.phone.match(phoneCheck)) {
        return true;
      }
      //message
      if (userData.message !== null && userData.message !== "") {
        return true;
      }
      else{
        return false;
      }
    }
    if(validate()){
      console.log(true);
    } else{
      console.log(false);
    }
  });
  
  /*//MAIL SEND
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'levon1.grigoryan@gmail.com',
      pass: ''
    }
  });
  
  var mailOptions = {
    from: userData.username,
    to: userData.email,
    subject: userData.phone,
    text: userData.message
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  */
})();