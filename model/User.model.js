const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {Schema,model} = mongoose;
require("dotenv").config();

const UserModel = Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minLength : 8
    },
    detail : {
        type : mongoose.Types.ObjectId,
        ref : "Detail"
    },
    post : [
        {
            type: mongoose.Types.ObjectId,
            ref : "post"
        }
    ],
    followings : [
        {
            type : mongoose.Types.ObjectId,
            ref : "User"
        }
    ],
    followers : [
        {
            type : mongoose.Types.ObjectId,
            ref : "User"
        }
    ]

})

UserModel.methods = {
    createAccessToken : async function(){
        try{
            const {_id} = this;
            const smtoken = await jwt.sign({
                "uid" : _id
            },process.env.SM_PRIVATE_KEY,{
                "expiresIn" : "7d"
            })

            return smtoken
        }catch(e){
            return false;
        }
    }
}


module.exports = model("user",UserModel);