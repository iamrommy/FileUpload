const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
const fileupload = require('express-fileupload');   
                                                
app.use(fileupload({    //middleware for file uploading
    useTempFiles: true, //these checks are added for uploading files at cloudinary
    tempFileDir : '/tmp/'
})); 

const connectToDB = require('./config/database');
connectToDB();

const cloudinary = require('./config/cloudinary'); //connecting to cloudinary
cloudinary.cloudinaryConnect();

const Upload = require('./routes/FileUpload');
app.use('/api/v1/upload', Upload);

app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`);
})
