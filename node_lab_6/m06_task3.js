const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "ricoysir1@gmail.com",
        pass: "hzwpvhtetzixfgnp",
    },
});

function send(message) {
    const options = {
        from: "ricoysir1@gmail.com",
        to: "ricoysir2@gmail.com",
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