const sgMail = require("@sendgrid/mail");
require("dotenv").config()
sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);
const Rest = require('../utils/Restware');
const JsonWebToken = require('jsonwebtoken');
const Config = require('../config/Global');
const UserManager = require('../manager/UserManager.js');


{/* <a href="https://exchange-website.herokuapp.com/v1/verify/${token}">Click me</a> */}
module.exports = {
    sendMailToVerifyAccount: function(email, token, callback) {
        const msg = {
            to: email,
            from: `${process.env.SENDER}`,
            subject: 'Verification your account',
            html: `<h3>To verify your account, click to the link below </h3>
            <button class="btn btn-success" onClick="verifyToken(${token})">Click here</button>`
        };

        sgMail.send(msg).then(()  => {
            return callback(null, null, 200, null, "account");
        })
        .catch((error) => {
            return callback(1, 'Send_mail_fail', 420, error, null);
        })
        return callback(null, null, 200, null, "Please check your Email, Thanks");

    },
    
    verifyToken: function(token) {
        console.log(token)
        window.open('https://www.google.com.vn/')

        JsonWebToken.verify(token, Config.jwtAuthKey, function(error, decoded) {
            if(error){
                return callback(1, 70, 'verify_token_fail', 400, error);
            }
            let result = [decoded.id, decoded.userName, decoded.type]
            UserManager.updateUserAfterRegister(result, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    window.open('https://www.youtube.com/');
                }
                window.open('https://www.google.com.vn/')
            })
        });
    },

    // verifyToken: function(token, callback) {
    //     JsonWebToken.verify(token, Config.jwtAuthKey, function(error, decoded) {
    //         if(error){
    //             return callback(1, 70, 'verify_token_fail', 400, error);
    //         }
    //         callback(null, null, 200, null, [decoded.id, decoded.userName, decoded.type]);
    //     });
    // },

    forgotPassword: function(email, token, callback) {
        const msg = {
            to: email,
            from: `${process.env.SENDER}`,
            subject: 'Verification your account',
            html: `<h3>To reset your password, click to the link below </h3>
                   <a href="http://localhost:3000/v1/verify/${token}">Click me</a>`
        };

        sgMail.send(msg).then(()  => {
            return callback(null, null, 200, null, "account");
        })
        .catch((error) => {
            return callback(1, 'Send_mail_fail', 420, error, null);
        })
        return callback(null, null, 200, null, "Please check your Email, Thanks");

    },

    
}