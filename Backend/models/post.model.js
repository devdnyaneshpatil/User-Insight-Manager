const mongoose=require("mongoose")

const postSchema = mongoose.Schema({
  userId:Number,
  title: String,
  body: String,
  company: String,
});

const PostModel=mongoose.model("post",postSchema)

module.exports=PostModel