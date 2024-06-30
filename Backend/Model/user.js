const mongoose=require("mongoose")
const schema=mongoose.Schema({
    name:String,
    password:String,
    email:String,
    token:String,
    photo:String,
unreadMessages:[String],
online: { type: String, default: "false" }
})
const model=mongoose.model("user",schema)
module.exports=model