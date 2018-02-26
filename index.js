(function () {

    "use strict";

    const conf = require("./gulp/conf");
    const pkg = require("./package");
    const compression = require("compression");
    const nodemailer = require("nodemailer");
    const express = require("express");
    const bodyParser = require("body-parser");
    const proxyMiddleware = require("http-proxy-middleware");
    const path = require("path");
    const deploy = require('./deploy');

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

    //FORM PARAMS
    let userData = {
        username: "",
        email: "",
        phone: "",
        message: ""
    };

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname + "/" + conf.paths.dist + '/index.html'));
    });
    app.post("/contact-request", function (req, res) {

        let takeInfo = req.body.user;

        userData.username = takeInfo.name;
        userData.email = takeInfo.email;
        userData.phone = takeInfo.phone;
        userData.message = takeInfo.message;


        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "bltcoin.contact.request@gmail.com", // generated ethereal user
                pass: "dearijogi777" // generated ethereal password
            }
        });

        let mailOptions = {
            from: userData["username"] + "<" + userData["email"] + ">",
            to: pkg["contact-email"],
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

    });
    app.post("/deploy", function (req, res) {
        res.sendStatus(200).end();
        deploy.init();
    });

    app.listen(8080);


})();