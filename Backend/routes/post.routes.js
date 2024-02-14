const express=require("express")
const { addPosts, getPosts } = require("../controllers/post.controllers")

const postRouter=express.Router()

postRouter.post("/:company",addPosts)
postRouter.get("/:userId",getPosts)

module.exports=postRouter