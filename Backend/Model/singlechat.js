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
    ]
})
const model=mongoose.model("singlemessanger",schema)
module.exports=model