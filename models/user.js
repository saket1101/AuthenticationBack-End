const mongoose = require("mongoose")
const express = require("express")
const jwt = require("jsonwebtoken")
const emailvalidator = require("email-validator")
const bcrypt = require("bcrypt")
require('dotenv').config()

const db_link = 'mongodb+srv://saket1101:saket1101@cluster0.wopm8cg.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(db_link)
    .then((db) => {
        console.log("db is connected")
    }).catch((err) => {
        console.log(err)
    })

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            return emailvalidator.validate(this.email)
        }
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 16
    },
    confirmPassword: {
        type: String,
        required: true,

    },
     tokens:[{
         token:{
             type:String,
             requried:true
         }
     }]
})

// userSchema.pre("save", function () {
//     this.confirmPassword = undefined
// })


// generating jwt token
userSchema.methods.generateAuthToken = async function () {
    try {
        const token =  jwt.sign({ _id:  this._id },process.env.SECRET_KEY)
        //console.log("this id tokne from user.js",token)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token;
    } catch (err) {
        console.log(err)
    }
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10)
        //this.confirmPassword = undefined
        //console.log(this.password)

    }
    next()
})
const User = mongoose.model("User", userSchema)

module.exports = User

