(function () {

    "use strict";

    const conf = require("./gulp/conf");
    const compression = require("compression");
    const sendmail = require("sendmail")();
    const express = require("express");
    const bodyParser = require("body-parser");
    const proxyMiddleware = require("http-proxy-middleware");
    const path = require("path");


    let proxyOptions = {
        target: "https://masternodes.online/currencies/BLT",
        changeOrigin: true
    };
    let app = express();

    app.use(compression());
    app.use(express.static(conf.paths.dist));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use("/api", proxyMiddleware(proxyOptions));

    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname + "/" + conf.paths.dist + '/index.html'));
        next();
    });

    //FORM PARAMS
    let userData = {
        username: "",
        email: "",
        phone: "",
        message: ""
    };

    app.post("/contact-request", function(req, res, next){

        let takeInfo = req.body.user;

        userData.username = takeInfo.name;
        userData.email = takeInfo.email;
        userData.phone = takeInfo.phone;
        userData.message = takeInfo.message;
        let phoneCheck = /^\d{10}$/;
        if(validateContactForm()){
            res.sendStatus(200);

            sendmail({
                logger: {
                    debug: console.log,
                    info: console.info,
                    warn: console.warn,
                    error: console.error
                },
                from: "no-reply@bitcoinlightning.co.uk",
                to: "levon1.grigoryan@gmail.com",
                subject: "Contact Request",
                html: "Hello World!",
            }, function(err, reply) {
                console.log(err && err.stack);
                console.dir(reply);
            });
        }
        else{
            console.log(false);
        }

        next();
    });

    // MAIL SEND

    function validateContactForm(){
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
        if (!!userData.message) {
            return true;
        }
        else{
            return false;
        }
    }

    app.listen(8080);
})();