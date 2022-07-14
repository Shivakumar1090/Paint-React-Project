const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const JWT_SECRET = require("../config/key");

const JWT_SECRET = "Secret key";

// login
router.post("/login" , async (req,res) => {
  const {email,password} = req.body;

  User.findOne({email : email})
    .then(async saveduser => {
      if(!saveduser){
        res.status(203).json({ message: "Invalid email" });
      } 
      else { 
        bcrypt.compare(password , saveduser.password)
        .then(async(domatch) => {
        if(domatch){
            const token = jwt.sign({ _id: saveduser._id }, JWT_SECRET);

            const { _id, name , email} = saveduser;

            res.status(200).json({
            token,
            user: {_id,name, email,},
            });
        }else{
            res.status(203).json({ message: "Invalid Password" });
            console.log("Invalid Password");
            }
        })
      }
    })
});

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      res.status(422).json({ message: "please Fill All the details" });
    }

    User.findOne({ email: email })
      .then(async (savedUser) => {
        if (savedUser) {
          //if user alredy present
          res.status(422).json({ message: "user already exists" });
        }
        //hashing password
        else {
          bcrypt.hash(password, 12).then(async (hashedpassword) => {
            const user = new User({
              email,
              password: hashedpassword,
              name,
            });
            user.save()
              .then(async (user) => {
                res.json({ message: "successfully signed in.", user});
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  module.exports = router;
