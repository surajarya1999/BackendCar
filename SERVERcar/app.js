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
// app.use(cors({
//   origin: ["http://localhost:5173","https://full-stack-car-rental-one.vercel.app/"],
//   credentials: true
// }))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://full-stack-car-rental-one.vercel.app"
  ],
  credentials: true
}));


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

app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  })
})

// app.listen(process.env.PORT, (req, res) => {
//   console.log(`server start localhost:${process.env.PORT}`)
// })
module.exports = app;