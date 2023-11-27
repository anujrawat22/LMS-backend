
const nodemailer = require('nodemailer')
const useremail = process.env.USER_EMAIL
const password = process.env.USER_PASSWORD

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: useremail,
        pass: password,
    }
})

function sendEmail(toEmail, subject, text) {
    const mailOptions = {
        from: 'your_email@gmail.com',
        to: toEmail,
        subject: subject,
        text: text,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            } else {
                console.log('Email sent:', info.response);
                resolve(info);
            }
        });
    });
}

module.exports = { sendEmail };