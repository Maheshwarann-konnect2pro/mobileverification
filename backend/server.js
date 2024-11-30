const express =require("express");
const cors=require('cors');
const mongoose = require("mongoose");
const axios =require("axios");
const UserModel = require('./models/user.js');
const dotenv = require('dotenv');
dotenv.config();


const app=express();
const port=5000;

app.use(cors());
app.use(express.json());

const FAST2SMS_API_KEY=process.env.FAST2SMS_API_KEY;
const mongouri=process.env.MONGO_URI;

let otpCache = {};

mongoose.connect(mongouri)
.then(()=>{console.log("connected to database")}).
catch((err)=>{console.log(err)});

app.get('/data',(req,res)=>{
    res.send("hello user");
});

app.post('/submit',async (req,res)=>{
    console.log("Incoming request body:", req.body);
    const {phonenumber,profilename}=req.body;
    if(!phonenumber){
        console.error("phone req");
        return res.status(400).send("required phone number");
    }
    // const VerifyDuplicate= await  UserModel.findOne({mobile:phonenumber});
    // if(VerifyDuplicate){
    //     console.error(VerifyDuplicate);
    //     return res.status(400).send("user already exists on this number");
    // }
    try {
        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        otpCache[phonenumber]=otp;

        // Prepare Fast2SMS API request
        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "q",
                numbers: phonenumber,
                message: `This code is for profile verification from Konnect2pro , your persnol code is  ${otp}   ,do not share with anyone`,
                language: "english",
                flash: 0,
            },
            {
                headers: {
                    authorization: FAST2SMS_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response.data);
        res.status(200).send({message:"otp sent successfully"});
    }   
    catch (error) {
    console.error("Error occurred while sending OTP:", error);
    res.status(500).send("Error occurred while sending OTP.");
    }
});

app.post('/verify',async (req,res)=>{
    const {phonenumber,profilename,enteredOtp}=req.body;

    if(!phonenumber || !profilename || !enteredOtp){
        res.status(400).send("phonenumber and  profilename  ,otp needed for saving user");
    }
    try{
        const storedOtp = otpCache[phonenumber];
        if (!storedOtp || enteredOtp !== storedOtp.toString()) {
            return res.status(400).send("Invalid OTP.");
        }
        const VerifyDuplicate= await  UserModel.findOne({mobile:phonenumber});
        if(!VerifyDuplicate){
            const newUser = new UserModel({
                name:profilename,
                mobile: phonenumber,
                verified: true, // Now the user is verified
            });
    
            await newUser.save();
        }
        delete otpCache[phonenumber];

        res.status(200).send({message:"user profile verified successfully"});
    }
    catch(error){
        console.error(`error while saving user ${error}`);
        res.status(400).send("error verifying user");
    }

})

app.listen(port,()=>{
    console.log("server started");
});
