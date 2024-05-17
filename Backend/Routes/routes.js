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

// POST-Api's

app.post("/sign", async (req, res) => {
  try {
    const { email, password, username, photo } = req.body;
    const check = await user.findOne({ email: email });
    const check2 = await user.findOne({ name: username });

    if (check) {
      res.json({ message: "User in database please login." });
    } else if (check2) {
      res.json({ message: "Username already taken." });
    } else if (signvalid.validate(req.body).error) {
      res.json({ message: signvalid.validate(req.body).error.message });
    } else {
      const token = jwt.sign(req.body, process.env.JWT);
      await user.create({
        name: username,
        email: email,
        password: hash(password),
        token: token,
        photo: photo
      });

      var welcome = {
        from: process.env.MAIL,
        to: email,
        subject: "Welcome to Chayo 💬",
        html: wlecome_page,
      };

      await transporter.sendMail(welcome);

      res.status(201).json({ message: "User Created!!", token: token, username: username, photo:photo });
    }
  } catch (error) {
    console.log("Error in sign up:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const check = await user.findOne({ email: email });

    if (!loginvalid.validate(req.body).error) {
      if (check) {
        if (hash(password) === check.password) {
          res.json({ token: check.token, username: check.name, message: "ok" , photo:check.photo});
        } else {
          res
            .status(200)
            .json({ message: "Password is wrong", d: check.password });
        }
      } else {
        res.json({ message: "User not in database" });
      }
    } else {
      res.json({ message: loginvalid.validate(req.body).error.message });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/check", async (req, res) => {
  try {
    const { email } = req.body;
    const check = await user.findOne({ email: email });
    if (check) {
      res.send({ username: check.name, token: check.token, message: "login", photo:check.photo });
    } else {
      res.send({ message: "sign" });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/firebase", async (req, res) => {
  try {
    const { username, password, email, photo } = req.body;
    const check = await user.findOne({ name: username });

    if (check) {
      res.send("Username taken");
    } else {
      const token = jwt.sign(req.body, process.env.JWT);
      await user.create({
        name: username,
        email: email,
        password: hash(password),
        token: token,
        photo: photo,
      });

      var welcome = {
        from: process.env.MAIL,
        to: email,
        subject: "Welcome to Chayo 💬",
        html: wlecome_page,
      };

      await transporter.sendMail(welcome);

      res.json({
        username: username,
        token: jwt.sign(req.body, process.env.JWT),
        message: "User created",
      });
    }
  } catch (error) {
    console.error("Error in Firebase sign up:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/otp", async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    var mailOptions = {
      from: "mohanavamsi16@outlook.com",
      to: req.body.email,
      subject: "Your otp " + otp,
      html:
        "<h1>Hey welcome</h1> <p>Here is your otp </p>" + `<h2> '${otp}'</h2>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("OTP sent");
    res.send(hash(otp));
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT

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
