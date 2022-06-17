const nodemailer = require('nodemailer')
require('dotenv').config()

// function to send OTP as an email to new registered user
module.exports = async (email, otp) => {

    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        service: 'gmail',
        // senders credentials
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    var mailOptions = {
        from: 'mohammadtalha0398@gmail.com',
        to: email,
        subject: 'Verify the OTP',
        html: `<h3> OTP is: </h3> <h1> ${otp} </h1>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}