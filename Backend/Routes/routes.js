const express = require("express");
const app = express();
const messanger = require("../Model/chat");
const user = require("../Model/user");
const singlemessanger=require("../Model/singlechat")
const nodemailer = require("nodemailer");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const cores = require("cors");
app.use(cores());
app.use(express.json())

function hash(password) {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

const wlecome_page = fs.readFileSync(path.join("index.html"), "utf8");

const signvalid = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  photo: Joi.string().required(),
});

const loginvalid = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().required(),
});

env.config();
app.use(express.json());
app.use(cors({origin:"*"}));

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "mohanavamsi16@outlook.com",
    pass: process.env.PASS,
  },
});
// GET-Apis's
app.get("/singledata/:roomid",async (req,res)=>{
  try {
    const roomdata = await singlemessanger.find({ roomid: req.params.roomid });
    res.status(200).json(roomdata);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

app.get("/data/:roomid", async (req, res) => {
  try {
    const roomdata = await messanger.find({ roomid: req.params.roomid });
    res.status(200).json(roomdata);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await user.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

app.get("/rooms", async (req,res)=>{
  try{
    const rooms=await messanger.find({})
    res.status(200).json(rooms)
  } catch(error){
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

app.put("/otpvalid", async (req, res) => {
  try {
    const otp = req.body.userotp;
    const hashedotp = req.body.otp;

    if (hash(otp) === hashedotp) {
      const update = await user.findOneAndUpdate(
        { email: req.body.email },
        { password: hash(req.body.password) }
      );
      if (!update) {
        res.send("User not in database");
      } else {
        res.send("Done");
      }
    } else {
      res.send("Invalid OTP");
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app;
