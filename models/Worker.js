const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose')
const workerSchema = new mongoose.Schema(
    {
        worker_name:{
            type:String,
            unique:true,
            required:'Please enter your name',
        },
        worker_address:{
            type:String,
            required:'Please enter your address'
        },
        worker_phone_number:{
            type:String,
            required:'Please enter your phone number'
        },
        worker_password:{
            type:String,
            required:'Please enter your password'
        },
        creation_date:{
            type:Date,
            default:Date.now
        }
    }
)
workerSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Worker",workerSchema)