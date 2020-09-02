const express = require('express')
const https = require('https')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const path = require('path')
const alert = require('alert')
const bcrypt = require('bcrypt')
const Requester = require('./models/Requester')
const Worker = require('./models/Worker')
const saltRounds = 10;
const app = express()
app.use(bodyParser.urlencoded({extended:true}))

const url = "mongodb://localhost:27017/iCrowd"
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true })
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log("Successful connection to "+ url)
})

// Requester API Route
app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, "public/register.html"));
})
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "public/index.html"));
})
app.get('/req_task', (req,res)=>{
    res.sendFile(path.join(__dirname,"public/req_task.html"))
})

app.post('/register_handler', function (req, res) {
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

app.post('/sign_in_handler', function (req,res) {
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

//Worker API Route
app.route('/workers')
.get((req,res)=>{
    Worker.find((err,workerList)=>{
        if(err) res.send(err)
        else res.send(workerList)
    })
})
.post((req,res)=>{
    const worker = new Worker({
        worker_name:req.body.name,
        worker_password:req.body.password,
        creation_date:req.body.creation_date,
        worker_phone_number:req.body.phone_number,
        worker_address:req.body.address
    })
    worker.save((err)=>{
        if (err) res.send("Error occurred: "+ err)
        else res.send('Successfully added a new worker!')
    })
})
.delete((req,res)=>{
    Worker.deleteMany((err)=>{
        if(err) res.send("Error occurred: " + err)
        else res.send('Successfully delete all worker!')
    })
})

app.route('/workers/:w_name')
.get((req,res)=>{
    console.log(req.params)
    Worker.findOne({worker_name: req.params.w_name},(err,foundWorker)=>{
        if (!err) {
            res.send(foundWorker)
        }
        else res.send("No Match Worker Found")
    })
})
.put((req,res)=>{
    Worker.update(
        {worker_name:req.params.w_name},
        {
            worker_name:req.body.name,
            worker_password:req.body.password,
            creation_date:req.body.creation_date,
            worker_phone_number:req.body.phone_number,
            worker_address:req.body.address
        },
        {overwrite:true},
        (err)=>{
            if(err) res.send(err)
            else res.send('Successfully updated!')
        }
    )
})
.patch((req,res)=>{
    console.log(req.params)
    Worker.update(
        {worker_name:req.params.w_name},
        {
            worker_name:req.body.name,
            worker_password:req.body.password,
            creation_date:req.body.creation_date,
            worker_phone_number:req.body.phone_number,
            worker_address:req.body.address
        },
        (err)=>{
            if (!err) res.send('Successfully updated')
            else res.send(err)
        }
    )
})

// 监听端口
var server = app.listen(8081, function () {
    console.log("server is running on http://127.0.0.1:8081")
})