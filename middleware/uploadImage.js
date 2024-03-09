// const fs = require('fs');
// // const path = require('path');
// const asyncHandler = require("express-async-handler");

//    module.exports = asyncHandler(async(req , res , next) => {
//       console.log("rrrrrrrrrrrr");
//      try {
//       console.log("Entire req object:", req);
//       console.log("Keys in req.files:", Object.keys(req.files));
//         if (!req.files ||  Object.keys(req.files).length == 0){ 
//          res.status(400).send({ message: "No files were uploaded!" });
//         }
//          const file = req.files.file;
         
//          console.log("file  :", file);
//          if(file.size > 1024 * 1024) {
//             removeTemp(file.tempFilePath)
//          res.status(400).send({ message: "File size is too large!" });
//         }

        
//      } catch (error) {
//          res.status(400).send({ message: error.message });
//      }
     
//     })
    
//    function removeTemp(path) {
//         fs.unlink(path , (err, file) => {
//             if (err) throw err;
//            })
//        }




// const fs = require('fs');

// module.exports = async function(req, res, next) {
//     try {
//         if(!req.files || Object.keys(req.files).length === 0){
//          // res.status(400).json({msg: "No files were uploaded."})
//          console.log("hereeeeeee");
//       }
//             console.log("go trough");
//         const file = req.files.file;
//         console.log(req.files.file);

//         if(file.size > 1024 * 1024){
//             removeTmp(file.tempFilePath)
//             return res.status(400).json({msg: "Size too large."})
//         } // 1mb

//         if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
//             removeTmp(file.tempFilePath)
//             return res.status(400).json({msg: "File format is incorrect."})
//         }

//         next()
//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// }




const multer = require('multer');
const fs = require('fs');

// Set up Multer storage and file filter
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('File format is incorrect.'), false);
        }
    }
}).single('file');  // 'file' is the field name in the form data

// Middleware for handling file upload
module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }
        const file = req.file;
        console.log('fileeeeee :' , file);

        if (!file) {
            return res.status(400).json({ msg: 'No files were uploaded.' });
        }
        res.status(200).json(file)
        if (file.size > 1024 * 1024) {
         removeTemp(file.tempFilePath);
            return res.status(400).json({ msg: 'Size too large.' });
        }
        // req.uploadedFile = file;
        next();
    });
};

   // function removeTemp(path) {
   //      fs.unlink(path , (err, file) => {
   //          if (err) throw err;
   //         })
   //     }

   function removeTemp(buffer) {
      // Assuming buffer is the property name for multer.memoryStorage()
      // Check the actual property name in your Multer setup
      // For example, if it's req.file.buffer, then use req.file.buffer
      if (buffer && Buffer.isBuffer(buffer)) {
          // File is in memory, nothing to delete, but you can clear the buffer
          buffer = null;
      }
  }
  