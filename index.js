const express = require("express")
const user = require("./models/user")
require('dotenv').config()
const cookieParser = require("cookie-parser")

const userRouter = require("./routers/userRouter.js")
port = process.env.PORT || 5000

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use("/user",userRouter)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})