const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : { 
        type : String,
        required : [true, "Please enter a username",]

    },
    email: { 
        type: String,
        required : [true, "Please enter an email"]
    }
    ,
    password:{
        type: String,
        required : [true, "Please enter an password",]
    },
    role : {
        type : String,
        default: 'user'
    },
    avatar : {
        type : String,
        default : 'https://res.cloudinary.com/dj6lyurd3/image/upload/v1709645127/authentication/b3snxp2aambc0sgkl4bj.png'
    }
}, {timestamps: true})

const User = mongoose.model('User',userSchema);

module.exports = User;