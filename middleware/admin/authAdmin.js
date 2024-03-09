const asyncHandler = require("express-async-handler");
const User = require("../../model/user.model");

const authAdmin = asyncHandler (async(req, res , next) => {
    try {
        
        // console.log("userrrrr    " ,req.user);
        const user = await User.findOne({_id :  req.user.payload})
        // console.log("Username :", user.username);
        if(user.role != "admin")  res.status(400).send({ message: "Admin access denied!" });
        console.log('admin user foundddddddddddddddddddddddddddd');
        next();
    } catch (error) {
    //   res.status(400).send({ message: "authorization failed" });
      res.status(400).send({ message: error.message  });
    }
})

module.exports = authAdmin