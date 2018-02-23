(function () {


    "use strict";

    const conf = require("./gulp/conf");
    const compression = require("compression");
    const nodemailer = require("nodemailer");
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

    app.get("/", function (req, res) {
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

    app.post("/contact-request", function (req, res, next) {

        let takeInfo = req.body.user;

        userData.username = takeInfo.name;
        userData.email = takeInfo.email;
        userData.phone = takeInfo.phone;
        userData.message = takeInfo.message;

        if (validateContactForm()) {

            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "bltcoin.contact.request@gmail.com", // generated ethereal user
                    pass: "dearijogi777" // generated ethereal password
                }
            });

            let mailOptions = {
                from: userData.username + "<" + userData.email + ">",
                to: "levon1.grigoryan@gmail.com",
                subject: "Contact Request",
                html: "<p>" + userData.message + "</p>"
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });

            res.sendStatus(200);
        }
        else {
            return alert("form is not valid");
        }

        next();
    });


    function validateContactForm() {
        //email
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(userData.email)) {
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
        else {
            return false;
        }
    }

    app.listen(8080);


})();