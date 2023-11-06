const mail = require('nodemailer');
require('dotenv').config();

const options = {
    service: "gmail",
    auth: {
        user: "kingsleyizima@gmail.com",
        pass: process.env.emailPass
    }
};

const sender = mail.createTransport(options);

module.exports = sender;