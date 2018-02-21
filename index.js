(function () {
  
  'use strict';
  
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
  /*app.use(bodyParser());
  
  app.post('/', function(request, response){
    console.log(request.body.user.name);
    console.log(request.body.user.email);
  });*/
  
  //MAIL SEND
  
  /*var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'levon1.grigoryan@gmail.com',
      pass: 'notl8zpx8z36'
    }
  });
  
  var mailOptions = {
    from: 'levon1.grigoryan@gmail.com',
    to: 'serget.antonyan@tumo.org',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });*/
  
})();