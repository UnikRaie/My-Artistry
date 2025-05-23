// loginRoute.js

const express = require('express');
const router = express.Router();
const UserModel = require("../models/Users");
const jwt = require('jsonwebtoken');
require('dotenv').config();     

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    // Generate token with expiration set to 30 days
                    const token = jwt.sign({ userId: user._id },process.env.LoginKey, { expiresIn: '30d' });
                    res.json({ status: "Success", token: token , role: user.role}); // Sending token back to client
                } else {
                    res.json("The password is incorrect");
                }
            } else {
                res.json("User not found");
            }
        })
        .catch(err => {
            console.error("Error:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

module.exports = router;
