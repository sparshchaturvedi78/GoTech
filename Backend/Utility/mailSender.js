const nodemailer = require("nodemailer");
require('dotenv').config();

async function mailSender(email, title, body) {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_KEY
            }
        })

        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log("mailSender information ", info);
        return info;
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports = mailSender;