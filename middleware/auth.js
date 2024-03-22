const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const asyncHandler = require("express-async-handler");
// const authIsLogged = (req, res, next) => {  //this is for controller needs to decode refresh token  
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       const token = req.headers.authorization.split(" ")[1];
//       console.log(token);
//       if (!token) res.status(400).send({ message: "no token provided" });

//       jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
//         if (error) res.status(400).send({ message: "no user found!" });
//         req.user = user;
//         console.log(user);
//         // User.findById(user._id)
//       });

//       next();
//     } catch (error) {
//       res.status(400).send({ message: "authorization failed" });
//     }
//   }
// };
const auth = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      if (!token) res.status(400).send({ message: "no token provided" });

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(error, user) => {
        console.log(user);
        if (error) res.status(400).send({ message: "no user found!" });
        req.user = user;
        console.log("user ",user);
        // User.findById(user._id)
      });

      next();//
    } catch (error) {
      res.status(400).send({ message: "authorization failed" });
    }
  }
};
module.exports = {
    auth,

    // authIsLogged
}
