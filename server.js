require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const userRoute = require('./routes/userRoute');
const uploadRoute= require('./routes/upload');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors());
// routes
app.use('/api/user', userRoute);
app.use('/api/upload' , uploadRoute);


  


mongoose.connect(process.env.MONGO_DB_URL ).then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

app.listen(port , () => {
    console.log(`server is running on port ${port} 🚀✅`);
});
