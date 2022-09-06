const User = require("../models/user")
const bcrypt = require("bcrypt")
const userRouter = require("../routers/userRouter")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

// user signup
module.exports.signup = async function signup(req, res) {
    try {
        let user
        const password = req.body.password
        const confirmPassword = req.body.password
        if (password === confirmPassword) {
            user = new User({
                name: req.body.name,
                email: req.body.email,
                password: password,
                confirmPassword: confirmPassword

            })
            
            const token = await user.generateAuthToken();
            res.cookie("jwt", token, { expires: new Date(Date.now()+ 50000), httpOnly: true })
            const registered = await user.save() 
            res.json({
                msg: "User signup",
                user: registered
            })
        } else {
            res.json({
                msg: "Invalid login"
            })
        }

    } catch (err) {
        res.json({
            status: "failed",
            msg: err.message
        })
    }

}

// userlogin 
module.exports.login = async function login(req, res) {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({ email: email })
        const isMatch = await bcrypt.compare(password, user.password)
        const token = await user.generateAuthToken();
        res.cookie("jwt", token, { expires: new Date(Date.now()+ 500000) , httpOnly: true })
        if (isMatch) {
            res.json({
                msg: "login successful",
                user: user
            })
        } else {
            res.json({
                msg: "Invalid login"
            })
        }

    } catch (err) {
        res.json({
            status: 'failed',
            msg: err.message
        })
    }
}
// user home after protech auth
module.exports.home = async function home (req,res){
  res.send ("hllo this is home page ")
}

// user logOut after protect auth
module.exports.logout = async function logout(req,res){
    try{
        // for current particular device logout
        // req.user.tokens = req.user.tokens.filter((currenToken) =>{
        //     return req.currenToken != req.token
        // })
        // from all device logout 
        //req.user.tokens= []
        res.clearCookie("jwt").send("logout succesfulll")
        await req.user.save()
        
    }catch(err) {
        res.status(500).send(err)
    }
}