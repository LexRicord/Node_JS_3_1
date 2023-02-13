const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "email1@gmail.com",
        pass: "pass",    //add to App Passwords in Google Account
    },
});

function send(message) {
    const options = {
        from: "email1@gmail.com",
        to: "email2@gmail.com",
        subject: "06_task3",
        text: message,
    }

    transporter.sendMail(options, (err, info) => {
        if(err) {
            console.log(err);
            return;
        }
        console.log("Sent: " + info.response);
    })
}

module.exports = send;