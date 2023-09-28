const express = require("express");
const bcrypt = require("bcrypt");
const { userModel } = require("../model/userModel");
const userRoute = express.Router();
require("dotenv").config();



userRoute.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(200).json({ msg: "user exist please login" })
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(400).json({ err: err.message })
            } else {
                const newUser = await new userModel({ ...req.body, password: hash })
                await newUser.save();
                return res.status(200).json({ msg: "user registered", user: req.body })
            }
        })
    } catch (err) {
        return res.status(400).json({ err: err.message })
    }
})


userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id, userName: user.username }, process.env.SecretKey)
                    return res.status(200).json({ msg: "login successful", token })
                } else {
                    return res.status(400).json({ msg: "wrong credentials" })
                }
            })
        } else {
            return res.status(400).json({ msg: "user not exist" })
        }
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
})


module.exports = { userRoute };