const mongoose=require("mongoose")
const schema=mongoose.Schema({
    roomid:{type:String},
    messages:[
        {
            user:String,
            message:String,
            time:Date,
            user_id:String
        }
    ]
})
const model=mongoose.model("messanger",schema)
module.exports=model