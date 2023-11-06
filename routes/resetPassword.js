const express = require('express');
const route = express.Router();
const userCollection = require("../schema/userSchema");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.secretWord;
const crypto = require('crypto-js');
const bcrypt = require('bcrypt');

route.patch('/', async (req, res) => {
    try {
        const { newPassword, otp, cipherText } = req.body;

        const decryptedID = crypto.AES.decrypt(cipherText, secretKey).toString(crypto.enc.Utf8);

        const user = await userCollection.findById(decryptedID);

        if (!user) return res.status(404).send("user doesn\'t exist");

        const uncodedToken = jwt.verify(user.resetPasswordToken, secretKey);

        const salt = bcrypt.genSaltSync(7);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        if (uncodedToken.otp == otp) {
            const now = new Date()
            if (user.resetPasswordTokenExpires < now) {
                await userCollection.findByIdAndUpdate(decryptedID, {
                    password: hashedPassword,
                    resetPasswordToken: '',
                    resetPasswordTokenExpires: now
                }, { new: true });

                return res.status(200).send("password changed");
            }
            res.send("OTP expired");
        }
    } catch (err) {
        res.status(err.status|| 500).send(err.message || "Internal Server Error");
    }
});

module.exports = route;