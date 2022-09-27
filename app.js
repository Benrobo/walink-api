const express = require("express")
const cors = require("cors")
const bodyParser = require ("body-parser")
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

const PORT = process.env.PORT || 5000


const log = (...params)=> console.log(...params)

app.listen(PORT, ()=> log(`server started at http://localhost:${PORT}`))
