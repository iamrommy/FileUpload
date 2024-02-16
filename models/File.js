const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String
    }

})

//post middleware 
fileSchema.post("save", async function(doc){ 
    try{
        console.log('DOC', doc);

       
        let transporter = nodemailer.createTransport({  
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER, 
                pass: process.env.MAIL_PASS,
            }
        });

        // send mail
        let info = await transporter.sendMail({ //This is used to send mails
            from: 'Rommy',
            to: doc.email,
            subject: "New File is Uploaded on Cloudinary",
            html: `<h2>Hello</h2> <p>File Uploaded <br/> View here : <a href="${doc.imageUrl}"> ${doc.imageUrl}</a> </p>`
        })

        console.log('INFO', info);
    }
    catch(error){
        console.error(error);
        
    }
})

const File = mongoose.model('File', fileSchema);
module.exports = File;