var express = require('express');
var router = express.Router();
const userCollection = require('../schema/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', async (req, res) => {
  try {
    const { userName, password } = req.body;

    const userDetails = await userCollection.findOne({ userName });

    if (!userDetails) return res.status(400).send("User not found");
    
    const { userName: savedUserName, password: savedPassword, phoneNumber } = userDetails;

    const isPasswordMatch = bcrypt.compareSync(password, savedPassword);

    if (!isPasswordMatch) return res.status(400).send('Password mismatch');

    await userCollection.findByIdAndUpdate(userDetails._id, { isNewUser: false });

    const token = jwt.sign({ savedUserName, phoneNumber }, process.env.secretWord);

    res.status(200).json({ message: "Login successfully", token });
  }
  catch (err) {
    res.status(500).send('Error while logging in');
  }
});

module.exports = router;