const nodemailer = require('nodemailer');
const Rest = require('../utils/Restware');
var email;
var otp = 0;

let Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`
    }
});

module.exports = {
    sendMail: function(req, res, httpCode) {
        otp = Math.random();
        otp = otp * 1000000;
        otp = parseInt(otp);

        email = req.body.email;

        var mailOptions = {
            to: email,
            subject: "OTP for registration is: ",
            html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
        };

        Transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return Rest.sendError(5, "Send_mail_fail", 400, error, "Send mail fail");
            }
            return Rest.sendSuccessOne(res, 'otp has been sent', 200);
        });
    },

    resendMail: function(req, res) {
        otp = Math.random();
        otp = otp * 1000000;
        otp = parseInt(otp);

        email = req.body.email;

        var mailOptions = {
            to: email,
            subject: "OTP for registration is: ",
            html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        Transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return Rest.sendError(5, "Send_mail_fail", 400, error, "Send mail fail");
            }
            return Rest.sendSuccessOne(res, 'otp has been sent', 200);
        });
    },

    verify: function(sender) {
        if(sender == otp){
            otp = 0;
            return true;
        }
        else{ 
            otp = 0;
            return false;
        }
    }
}