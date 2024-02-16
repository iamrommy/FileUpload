const File = require('../models/File')
const cloudinary = require('cloudinary').v2;

exports.localFileUpload = async(req,res)=>{
    try{
        // fetch files from request
        const file = req.files.file;
        console.log("File :- ", file);

        //create path where file needs to be stored on server
        let path = __dirname + '/files/' + Date.now() + `.${file.name.split('.')[1]}`; //spliting the extention from file name
        console.log('Path :- ', path);                                                 

        //add path to the move function
        file.mv(path, (err)=>{
            console.log(err);
        });
        
        //create response
        res.json({
            success:true,
            message:"Local file Uploaded sucessfully"
        })
    }
    catch(error){
        console.log(error);
    }
}

function isFileTypeSupported(type, supportedTypes){ //This function tells wether the file type is supported or not
    return supportedTypes.includes(type); 
}

async function uploadFileToCloudinary(file, folder, quality){ //This function uploads a file to cloudinary
    const options = { 
        folder,
        resource_type: "auto"
    }

    if(quality){//if quality is sent to this function then quality option will be set to options to reduce quality
        options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}                                                                        

exports.imageUpload = async (req,res)=>{
    try{
        //data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ['jpg', 'jpeg', 'png'];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log(fileType);

        //if file formated is not supported
        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: 'File format not supported'
            })
        }

        //if file formated is supported
        const response = await uploadFileToCloudinary(file, 'FileUpload'); //upload file to required folder name in cloudinary
        console.log(response);

        //save entry in Database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image successfully uploaded'
        })       


    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message: 'Something went wrong'
        })
    }
}

//video upload handler

exports.videoUpload = async (req, res)=>{
    try{
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;
        console.log(file);

        //validation
        const supportedTypes = ['mp4', 'mov'];
        const fileType = file.name.split('.')[1].toLowerCase();       
        console.log(fileType);

        //here we have added an upper limit of 5mb for video, 5mb into bytes will 5242880 bytes
        if(file.size > 5242880){
            return res.status(400).json({
                success: false,
                message: 'File size is greater than 5mb'
            })
        }

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: 'File format not supported'
            })
        }

        const response = await uploadFileToCloudinary(file, 'FileUpload'); //upload file to required folder name in cloudinary
        console.log(response);

        //save entry in Database
        const fileData = await File.create({
            name,
            tags,
            email,
            videoUrl: response.secure_url,
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'video successfully uploaded'
        })       
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message: 'Something went wrong'
        })
    }
}

//image size reduce and then upload to cloudinary
exports.imageSizeReducer = async(req,res)=>{
    try{
        //data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ['jpg', 'jpeg', 'png'];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log(fileType);

        //if file formated is not supported
        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: 'File format not supported'
            })
        }

        //if file formated is supported
        const response = await uploadFileToCloudinary(file, 'FileUpload', 50); //upload file to required folder name in cloudinary
                                                                                //here quality of image will be reduced upto 50 percent
        console.log(response);                                 

        //save entry in Database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image successfully uploaded'
        })       


    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message: 'Something went wrong'
        })
    }
}