const mongoose = require("mongoose")
const requesterGoogleSchema = new mongoose.Schema({
    googleId:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Requester_google',requesterGoogleSchema);//将schema编译为model构造函数