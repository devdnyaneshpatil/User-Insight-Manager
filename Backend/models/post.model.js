const mongoose=require("mongoose")

const postSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: String,
  body: String,
  company: String,
});

const PostModel=mongoose.model("post",postSchema)

module.exports=PostModel