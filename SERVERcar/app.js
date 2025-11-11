const express = require('express')
const app = express()
const cookie = require('cookie-parser')
const web = require('./route/web')
const connectdb = require('./db/connectDB')
const cors = require('cors')
const env = require('dotenv')
const fileUpload = require('express-fileupload')



env.config()
//cors for fetching
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",   // zaroori hai cloudinary ke liye
}));


//mogoose
connectdb()
//cookie
app.use(cookie())

app.use(express.json())

app.use('/api', web)

app.listen(process.env.PORT, (req, res) => {
    console.log(`server start localhost:${process.env.PORT}`)
})