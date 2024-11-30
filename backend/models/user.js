const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        require:true,
        unique:true
    },
    verified: {
        type: Boolean,
        default: false, // By default, the user is not verified
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});


const UserModel=mongoose.model('users',userschema);

module.exports=UserModel;