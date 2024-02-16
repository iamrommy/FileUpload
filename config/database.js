const mongoose = require('mongoose');

require('dotenv').config();

const connectToDB = ()=>{
    mongoose.connect(process.env.MONOGDB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log('DB connection successfull'))
    .catch((error)=>{
        console.log('Issues in connection to DB');
        console.error(error);
        process.exit(1);
    })
}

module.exports = connectToDB;