const express=require("express")
const { getUser, addUser } = require("../controllers/user.controllers")

const userRouter=express.Router()

userRouter.get("/:id",getUser)
userRouter.post("/add",addUser)

module.exports=userRouter