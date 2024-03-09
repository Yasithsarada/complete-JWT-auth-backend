const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const mongoose = require("mongoose");

const isLoggedin = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) res.status(400).send({ message: "no token provided" });
      console.log(token);

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //   console.log(decodedToken);

      const user = await User.findById(decodedToken.id).select("-password");
      if (!user) res.status(400).send({ message: "no user found!" });
        req.user = user;
      next();
    } catch (error) {
      console.log(error.message);
      res.status(401).send({message : "not authorized!"})
    }
  } else
    res.status(400).send({ message: "no authorization headers provided!" });
};

module.exports = {
  isLoggedin,
};
