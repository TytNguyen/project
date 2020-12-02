const sgMail = require("@sendgrid/mail");
require("dotenv").config()
sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);
const Rest = require('../utils/Restware');

var otp;

module.exports = {
    sendGrid: function(req, res, httpCode) {
        otp = Math.random();
        otp = otp * 1000000;
        otp = parseInt(otp);

        const msg = {
            to: req.body.email,
            from: `${process.env.SENDER}`,
            subject: 'Verification your account',
            html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp + "</h1>" 
        };
                
        sgMail.send(msg).then(()  => {
            return Rest.sendSuccessOne(res, 'otp has been sent', 200);
        })
        .catch((error) => {
            return Rest.sendError(5, "Send_mail_fail", 400, error, "Send mail fail", null);
        })
        console.log(otp)
        return Rest.sendSuccessOne(res, 'otp has been sent', 200);

    },

    verify: function(sender) {
        console.log(otp)
        console.log(sender)
        if(sender == otp){
            // otp = 0;
            return true;
        }
        else{ 
            // otp = 0;
            return false;
        }
    }
}