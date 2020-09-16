const mongoose = require("mongoose")
const requesterSchema = new mongoose.Schema({
    country: {
        type: String,
        required: [true, 'Please choose country']
    },
    first_name: {
        type: String,
        required: [true, 'Please enter first name']
    },
    last_name: {
        type: String,
        required: [true, 'Please enter last name']
    },
    email: {
        type: String,
        unique: [true, 'This email is already been registered'],
        required: [true, 'Please enter email'],
        match: /^[a-zA-Z0-9_-]+@.*?/
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        validate: function (arg) {
            return arg.length >= 8
        }
    },
    confirm_password: {
        type: String,
        required: [true, 'Please enter confirm_password'],
        validate: function (arg) {
            return arg === this.password;
        }
    },
    address: {
        type: String,
        required: [true, 'Please enter address']
    },
    city: {
        type: String,
        required: [true, 'Please enter address']
    },
    state_province_region: {
        type: String,
        required: [true, 'Please enter state province and region']
    },
    zip: {
        type: String
    },
    phone_number: {
        type: Number
    },
})

module.exports = mongoose.model('Requester', requesterSchema);//将schema编译为model构造函数