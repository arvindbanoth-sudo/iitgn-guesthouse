const mongoose =require('mongoose');
const otpschema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{type:Date,default:Date.now,index:{expires:700}}
})

module.exports=otpmodel=mongoose.model('otpmodel', otpschema)