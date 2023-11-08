const express = require('express');
const { connect } = require('mongoose');
require('dotenv').config();

const url = process.env.mongodbURL;
const port = process.env.port;

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const forgotPasswordRoute = require('./routes/forgotPassword');
const resetPasswordRoute = require('./routes/resetPassword');

connect(url).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("failed to connect because", err);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth/login', loginRoute);
app.use('/auth/register', registerRoute);
app.use('/auth/forgot-password', forgotPasswordRoute);
app.use('/auth/reset-password', resetPasswordRoute);

app.listen(port, () => {
    console.log("Listening on port", port);
});