const express = require("express")
const userRouter = express.Router()
const auth = require("../protectAuth/auth")
const { signup, login,home,logout } = require("../controller/userController")



userRouter.route("/signup").post(signup)

userRouter.route("/login")
.post(login)

userRouter.use(auth)
.route("/home")
.get(home)


userRouter.use(auth)
.route("/logout")
.get(logout)

module.exports = userRouter