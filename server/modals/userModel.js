import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    verifyOTP:{
        type:String,
        default:''
    },
    verifyOTPExpireAt:{
        type:Number,
        default:0
    },
    isAccountVerified:{
        type:boolean,
         default: false
    }
})