const mongoose=require("mongoose")

const userSchema = mongoose.Schema({
  id:Number,
  name: String,
  email: String,
  phone: String,
  website: String,
  city: String,
  company: String,
});

const UserModel=mongoose.model("user",userSchema)

module.exports=UserModel