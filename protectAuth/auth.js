const jwt = require("jsonwebtoken")
const User = require("../models/user")


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({ _id: verifyUser._id })

        next()
    } catch (err) {
        res.send(err)
    }
}

module.exports = auth