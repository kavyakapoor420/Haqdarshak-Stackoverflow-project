import mongoose from 'mongoose'

const agentSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        required:true 
    },
    password:{
        type:String,
        required:true 
    },
    role:{
        type:String,
        enum:['agent','admin'],
        default:'user'
    }
})

const Agent=mongoose.model("Agent",agentSchema)

export default Agent 