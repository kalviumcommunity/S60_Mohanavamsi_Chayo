const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config()
async function connect() {
    try{
    await mongoose.connect(process.env.URI)
    console.log("connected")
    }
    catch(er){
        console.log("error",er)
    }
}
module.exports={connect:connect};