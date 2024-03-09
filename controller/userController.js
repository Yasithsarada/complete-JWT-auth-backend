const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../model/user.model");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const sendMail = require("./sendMail");
const  { CLIENT_URL } = process.env;

const signUpUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      res.status(401).send({ message: "Please fill out all the fields!" });

    if (!validateEmail(email)) res.status(400).json("Enter valid email");

    if (password.length < 8)
      res
        .status(401)
        .send({ message: "Password should be a least 8 charctors long!" });

    const user = await User.findOne({ email });
    if (user) res.status(200).json("User already exists with this email");

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(hashedPassword);
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    console.log(newUser);
    if (!newUser)
      res.status(401).send({ message: "User not succeccessfully created !" });
    if (newUser)
      res
        .status(200)
        .json({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          token: generateActivationToken(newUser._id),
        });
  } catch (error) {
    res.status(200).send({ message: "something went wrong" });
  }
  // res.send({message: "sign up contoller!"});
});

// const activateEmail = asyncHandler(async (req, res) => {
//     const {activationToken} = req.body;
//     if (!activationToken) res.status(400).send({ message: "no activation token provided" });

//     const decodedToken = jwt.verify(activationToken, process.env.JWT_SECRET_KEY);

//     const user = await User.findOne({email});
//     if(user) res.status(200).json("User already exists with this email");

//     const newUser = await User.create({
//       username  ,
//       email  ,
//       password ,
//   })

//     if(!newUser) res.status(401).send({ message:"User not succeccessfully created !"})
//     if(newUser) res.status(200).json({message:"Account succeccessfully activated !", username:newUser.username,email:newUser.email ,password: newUser.password, token : generateActivationToken(newUser._id)})
// })

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    //   console.log( generateActivationToken(user._id));
    if (!user) res.status(403).json({ message: "Invalid emaill or password" });

    const isPaasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPaasswordMatched)
      res.status(403).json({ message: "Invalid emaill or password" });
      // sendMail("dilushi1994@gmail.com" , "gbeaeeeeee" ,"test")
    const refreshToken = generateRefreshToken(user._id);
    // console.log(refreshToken);
   res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/api/user/refresh_token",
    });
    
    // console.log(cookie);
    if (user && isPaasswordMatched)
      res
        .status(200)
        .json({
          id: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          REFRESH_token: refreshToken
        });
    //   else {res.status(400).send({message : "something went wrong"})}
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

const userData = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // console.log(user);
    res.send({
      message: "user data controller!",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

const getAccessToken = asyncHandler(async(req, res) => {
  try {
    const ref_Token = req.cookies.refreshToken
    // console.log(ref_Token);
    if(!ref_Token) res.status(400).json({ message: "Log in again" });
    // console.log(process.env.REFRESH_TOKEN_SECRET);
     jwt.verify(ref_Token , process.env.REFRESH_TOKEN_SECRET , (err, decodedtokenUser) => {
      if(err) res.status(400).json({ message: "refresh token not decoded!" });
      const accessToken = generateAccessToken(decodedtokenUser.id);
      console.log("getAccessToken :",decodedtokenUser.id);
      res.json({accessToken : accessToken});
     })
    
  } catch (error) {
    res.status(400).json({ message: error.message});
  }
})

const forgotPassword = asyncHandler(async(req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({email});
    if(!user) res.status(403).json({ message: "User does not  exist!" });

    const accessToken = generateAccessToken(user._id);
    console.log("forgotPassword :",user._id);
    const url = `${CLIENT_URL}/user/reset/${accessToken}`

    sendMail(email , url ,"Reset your password")

    res.status(200).json({ message: "resesnd the password...check ur mail"})
  } catch (error) {
    res.status(400).json({ message: error.message});
  }
})

const resetPassword = asyncHandler(async(req, res) => {
  try {
    const {password} = req.body;
    if(!password) res.status(403).json({ message: "Enter password"})

   const hashedPassword = await bcrypt.hash(password , 12)
    await User.findOneAndUpdate({_id: req.user.payload } , { password: hashedPassword})
    res.status(200).json({ message: "Password changed successfully"})
    console.log(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message});
  }
})

const getUserInfo = asyncHandler(async(req, res) => {
    try {
      
      console.log(req.user.payload);
      const  user = await User.findById(req.user.payload)

      res.status(200).json(user)
    } catch (error) {
      
    }
})

const getAllUserInfo = asyncHandler(async(req, res) => {
    try {
      
      console.log("uuuuuuuuu",req.user.payload);
      // const user = await User.find().select("-password")
      const users = await User.find().select("-password");

      console.log(users);

      res.status(200).json(users)
    } catch (error) {
      
    }
})

const logout = asyncHandler(async(req, res) => {
try {
    res.clearCookie('refreshToken' , {path:'/api/user/refresh_token'})
    res.json({message:"Loggedd out!"})
} catch (error) {
  res.status(400).send({ message: "Couldn't log out!"});
}
})
const updateUser = asyncHandler(async(req, res) => {
 try {
  // console.log("ggggggg");
   const { username , avatar } = req.body;
  //  if(!username || )
   console.log("update controller :",req.user.payload);
   const updatedUser = await User.findOneAndUpdate({_id: req.user.payload}, { username , avatar})
  
   const user = await User.findById(req.user.payload)
   if(!updatedUser) res.status(400).send({ message: "update not successful ! try again"});
  console.log(user);
   res.json({message:"update successful !" })
 } catch (error) {
   res.status(400).send({ message: "update not successful !"});
 }
})

const updateUserRole = asyncHandler(async(req, res) => {
  try {
   console.log("olllllllllll");
    const { role } = req.body;
   //  if(!username || )
  //  console.log(req.user);
    console.log("update controller :",req.user.payload);
    const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, { role})
    console.log(req.params.id);
  //  if(!updatedUser) res.status(400).send({ message: "update not successful..try again !"})
    res.json({message:"update successful !" } )
    
  } catch (error) {
    res.status(400).send({ message: "update not successful !"});
  }
 })

 const deleteUser = asyncHandler(async(req, res) =>{
 try {
   const id = req.params.id;
   console.log(id);
   await User.findByIdAndDelete(req.params.id);
   res.status(200).send({ message: "delete successful" })
 } catch (error) {
  res.status(400).send({ message: "Deletion not successful !"});
 }

 })


const generateActivationToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  } catch (error) {
    return "Error generating token ";
  }
};
const generateAccessToken = (payload) => {
  try {
    return jwt.sign({payload}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
  } catch (error) {
    return "Error generating token ";
  }
};
const generateRefreshToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1h",
    });
  } catch (error) {
    return "Error generating token ";
  }
};
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


module.exports = {
  signUpUser,
  loginUser,
  userData,
  // activateEmail,
  getAccessToken,
  forgotPassword ,
  resetPassword,
  getUserInfo,
  getAllUserInfo,
  logout,
  updateUser,
  updateUserRole,
  deleteUser
};