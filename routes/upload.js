const express = require('express');
const upload = require('../controller/uploadCtrl');
const uploadImage = require('../middleware/uploadImage');
const router = express.Router();
const {auth} =  require('../middleware/auth')

router.post('/upload-avatar' ,auth ,  uploadImage  , upload )





module.exports = router