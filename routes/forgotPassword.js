const express = require('express');
const route = express.Router();
const userCollection = require("../schema/userSchema");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.secretWord;
const sender = require('../utils/mailer');
const crypto = require('crypto-js');

route.patch('/', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userCollection.findOne({ email });
        if (!user) return res.status(404).send("user doesn\'t exist");

        const otp = Math.floor(100000 + Math.random() * 900000);

        const token = jwt.sign({ otp }, secretKey);

        user.resetPasswordToken = token;
        user.resetPasswordTokenExpires= new Date() + (10*60*1000);

        const cipherText = crypto.AES.encrypt(user._id.toString(), secretKey).toString();

        await user.save();

        sender.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `
                <div>
                    <h1>You asked to reset your password</h1>
                    <p>Please ignore if you did not initate this action</p>
                    <p>Click <a href="">here</a> to reset password</p>
                    <p>Or use this OTP: ${otp} and this cypher: ${cipherText}</p>
                    <p>Careful the OTP expires in 10 minutes</p>
                </div>
            `
        });

        res.send("Email sent succesfully");
    } catch (err) {
        console.log(err);
        res.status(err.status|| 500).send(err.message || "Internal Server Error");
    }
});

module.exports = route;