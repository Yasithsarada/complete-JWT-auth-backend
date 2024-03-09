 const express = require('express');
const { signUpUser, loginUser, userData, generateAccessToken, getAccessToken, forgotPassword, resetPassword, getUserInfo, logout, updateUser, updateUserRole, deleteUser } = require('../controller/userController');
const { isLoggedin } = require('../middleware/authUser');
const { auth} = require('../middleware/auth');
const authAdmin = require('../middleware/admin/authAdmin');
const router = express.Router();

router.post('/signup', signUpUser)  
router.post('/login', loginUser)
router.get('/userData',isLoggedin,userData)
router.get('/refresh_Token' , getAccessToken);  // actually gives the access token
router.post('/forgot' , forgotPassword);
router.post('/reset' , auth , resetPassword);
// router.get('/info' , authIsLogged , getUserInfo);
router.get('/info' , auth , getUserInfo);
router.get('/all-info' , auth ,authAdmin, getUserInfo);
router.post('/logout' ,  logout);
router.post('/update' , auth , updateUser); 
router.post('/update-role/:id' , auth, authAdmin , updateUserRole); 
router.delete("/delete/:id" , auth , authAdmin , deleteUser)

module.exports = router;