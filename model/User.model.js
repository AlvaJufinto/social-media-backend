const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {Schema,model} = mongoose;
require("dotenv").config();

const UserModel = new Schema({
    username : {
        type : String,
        required : [true,"Field needs to be filled"],
        unique : [true, "Username must unique"],
        validate : /^\w+$/
    },
    password : {
        type : String,
        required : [true,"Field needs to be filled"],
        minLength : 8
    },
    fullname : {
        type : String,
        required : [true,"Field needs to be filled"],
    },
    email : {
        type : String,
        required : [true,"Field needs to be filled"],
        unique : [true, "email must unique"],
        validate : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    detail : {
        type : mongoose.Types.ObjectId,
        ref : "detail",
        required : [true,"Field needs to be filled"]
    },
    post : [
        {
            type: mongoose.Types.ObjectId,
            ref : "post"
        }
    ],
    profilePict : {
        imageUrl : {
            type : String,
            required : [true,"Field needs to be filled"],
            default : "zamndaniel"
        },
        imageID : {
            type : String,
            required : [true,"Field needs to be filled"],
            default : "zamndaniel"
        }
    },
    backgroundPict : {
        imageUrl : {
            type : String,
            required : true,
            default : "zamndaniel"
        },
        imageID : {
            type : String,
            required : true,
            default : "zamndaniel"
        }
    },
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