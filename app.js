const express = require("express")
const cors = require("cors")
const bodyParser = require ("body-parser")
const authRouter = require("./routes/auth")
const linkRouter = require("./routes/link")
const { DATABASE_URL } = require("./config")
const mongoose = require('mongoose')

require ("dotenv").config()

const app = express()

// middlewares
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res)=>{
  return res.json({
    message: " Welcome to Whatsapp Link"
  })
})

app.use("/api/auth", authRouter)
//app.use("/api/link", linkRouter)



const PORT = process.env.PORT || 5000


const log = (...params)=> console.log(...params)

const DB_URL = "mongodb+srv://walink:1234@cluster0.q4jqt3j.mongodb.net/walink?retryWrites=true&w=majority"

mongoose.connect(DB_URL, { useNewUrlParser: true }).then((res) => {
  console.log("MONGODB CONNECTED")
  return app.listen(PORT, () => {
    console.log(`Server listening @ http://localhost:${PORT}`);
  })

}).catch((err) => {
  log(err)
  console.log(`Error connecting database: ${err.message}`);
})
