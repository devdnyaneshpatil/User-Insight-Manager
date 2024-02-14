const express=require("express")
require("dotenv").config()
const cors=require("cors")
const connection = require("./config/db")
const app=express()
app.use(cors())
app.use(express.json())

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("connected to the server")
        console.log(`Server is running on port:-${process.env.PORT}`)
    } catch (error) {
        console.log(error.message)
    }
})