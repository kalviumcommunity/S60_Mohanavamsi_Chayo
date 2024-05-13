const mongoose=require("mongoose")
const schema=mongoose.Schema({
    roomid:String,
    messages:[
        {
            user:String,
            message:String,
            type:{type:String,default:"text"},
            time:Date,
            photo:String,
            user_id:String
        }
    ],
    password:String
})
const model=mongoose.model("messanger",schema)
module.exports=model