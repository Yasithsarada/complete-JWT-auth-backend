const cloudinary = require('cloudinary');
const asyncHandler = require('express-async-handler');

 cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  
console.log('cloudinary config done :'   );
const upload = asyncHandler(async  (req, res) => {
    try {
        console.log("tttttttttttttttttt");
        // const file = req.files.file;
        // console.log(req.file);
        const file = req.file;
        // console.log('goleeeee:', file.buffer);
       
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        // const cldRes = await handleUpload(dataURI);
        // res.json(cldRes);
        console.log("dataURI : " , dataURI);

          cloudinary.v2.uploader.upload(dataURI, {folder : 'avatar' , width : 150, height : 150 , crop : 'fill'} , asyncHandler(async(error , result) => {
          if (error) throw error;
          console.log({result : result});
        }));
 
          
        console.log(file);

        // if (!req.file) {
        //   return res.status(400).json({ message: 'No image file uploaded' });
        // }
    
        // const result = await cloudinary.v2.uploader.upload(req.file.buffer, {
        //   folder: 'avatar', // Specify a folder for organization
        //   width: 150,
        //   height: 150,
        //   crop: 'fill',
        //   resource_type: 'auto', // Automatically detect image/video type
        // });
    
        // console.log({ result }); // Log the upload result
        // res.status(200).json({ message: 'Image uploaded successfully!', data: result }); // Send success response
      
    } catch (error) {
        // res.status(400).send({ message: "error.message" });        
    }
})


const uploadHandler = asyncHandler(async (req, res) => {
  await cloudinary.v2.uploader.upload()
})

module.exports = upload;