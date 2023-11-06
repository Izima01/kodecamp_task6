const express = require('express');
const bcrypt = require('bcrypt');

const route = express.Router();
const userCollection = require('../schema/userSchema');

route.post('/', async (req, res) => {
  try {
    const { email, phoneNumber, userName, password } = req.body;

    const salt = bcrypt.genSaltSync(7);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const isUserExist = await userCollection.findOne({ userName: userName });

    if (isUserExist) return res.status(400).send("Username unavailable");

    await userCollection.create({
      email, phoneNumber, userName, password: hashedPassword, isNewUser: true
    });

    res.status(201).send("Account created successfully");
  }
  catch (error) {
    res.status(500).json({messsage: 'Error while creating account', error });
  }
});

module.exports = route;
