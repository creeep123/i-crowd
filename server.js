const express = require('express')
const https = require('https')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const path = require('path')
const alert = require('alert')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const url = "mongodb://localhost:27017/iCrowd"
mongoose.connect(url)
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log("Successful connection to "+ url)
});

var requesterSchema = mongoose.Schema({
    country:{
        type:String,
        required:[true,'Please choose country']
    },
    first_name:{
        type:String,
        required:[true,'Please enter first name']
    },
    last_name:{
        type:String,
        required:[true,'Please enter last name']
    },
    email:{
        type:String,
        unique:[true,'This email is already been registered'],
        required:[true,'Please enter email'],
        match:/^[a-zA-Z0-9_-]+@.*?/
    },
    password:{
        type:String,
        required:[true,'Please enter password'],
        validate:function(arg){
            return arg.length>=8
        }

    },
    confirm_password:{
        type:String,
        required:[true,'Please enter confirm_password'],
　　　　validate: function(arg) {
    　　　　　　return arg === this.password;
　　　　}
    },
    address:{
        type:String,
        required:[true,'Please enter address']
    },
    city:{
        type:String,
        required:[true,'Please enter address']
    },
    state_province_region:{
        type:String,
        required:[true,'Please enter state province and region']
    },
    zip:{
        type:String
    },
    phone_number:{
        type:Number
    },
})
var Requester = mongoose.model('Requester',requesterSchema);//将schema编译为model构造函数

// get 请求
app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, "public/register.html"));
})
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "public/index.html"));
})
app.get('/req_task', (req,res)=>{
    res.sendFile(path.join(__dirname,"public/req_task.html"))
})


//  POST 请求
app.post('/register_handler', urlencodedParser, function (req, res) {
    let temp_requester = req.body
    // 存入前加密
    bcrypt.genSalt(saltRounds, function(err, salt) {
        //加密 密码
        bcrypt.hash(temp_requester.password, salt, function(err, hash) {
            if(err) return console.log('Hash password err')
            temp_requester.password = hash
            //加密 确认密码
            bcrypt.hash(temp_requester.confirm_password, salt, function(err, hash){
                if(err) return console.log('Hash confirm_password err')
                temp_requester.confirm_password = hash
                //存入数据库
                let newRequester = new Requester(temp_requester)// Mongoose 会自动找到名称是 model 名字复数形式的 collection
                newRequester.save((err)=>{
                    if(err) {
                        alert(err)
                        return console.log("\n\n this is the error \n\n" + err);
                    }
                    // 调用 web API 发送欢迎邮件
                    const first_name = req.body.first_name
                    const last_name = req.body.last_name
                    const email = req.body.email
                    const data = {
                        members:[{
                            email_address:email,
                            status: "subscribed",
                            merge_fields:{
                                FNAME:first_name,
                                LNAME:last_name
                            }
                        }]
                    }
                    let jsonData = JSON.stringify(data)
                
                    const apiKey = "817c5383f38a94228303f5029c828584-us17" 
                    const list_id = "797d0cb446"
                    const url = "https://us17.api.mailchimp.com/3.0/lists/797d0cb446"
                    const options={
                        method:"POST",
                        auth:"david:817c5383f38a94228303f5029c828584-us17"
                    }
                
                    const request = https.request(url, options, (res)=>{
                        res.on("data",(data)=>{
                            let jsData = JSON.parse(data)
                            if (jsData.error_count==0){
                                console.log("send welcome email successfully")
                            }else{
                                console.log("error:"+jsData.errors[0].error)
                            }
                        })
                    })
    
                    request.write(jsonData)
                    request.end()

                    alert("Registered Successfully");
                    res.redirect('/');
                    return console.log("Registered Successfully");
                })
                return console.log("Hash confirm_password successfully")
            })
            return console.log("Hash password successfully")
        })
    })
    
})

app.post('/sign_in_handler', urlencodedParser, function (req,res) {
    let temp_sign_in_user = req.body
    //数据库查询输入邮箱值
    Requester.findOne({
        'email':temp_sign_in_user.email,
    },
        function (err,requester) {
            if(err) return console.log(err)
            if(requester){
                // 对比输入密码和数据库存储哈希
                bcrypt.compare(temp_sign_in_user.password, requester.password).then(function(result){
                    if (result){
                        res.redirect("/req_task")
                        console.log("Login Successfully")
                    }else{
                        res.send("Wrong password")
                    }
                })
            }else{
                res.send("No such email")
            }
    })
})

// 监听端口
var server = app.listen(8081, function () {
    console.log("server is running on http://127.0.0.1:8081")
})