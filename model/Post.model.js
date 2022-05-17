const mongoose = require("mongoose");
const {Schema,model} = mongoose

const PostModel = Schema({
    belongsto : {
        type : mongoose.Types.ObjectId,
        required : [true,"Field needs to be filled"],
        ref : "User"
    },
    image : {
        imageUrl : {
            type : String,
        },
        imageID : {
            type : String,
        }
    },
    description : {
        type : String,
        maxLength : [250, "maximal length is only 250 char"]
    },
    comments : [
        {
            type : mongoose.Types.ObjectId,
            ref : "comment"
        }
    ],
    likes : [
        {
            type : mongoose.Types.ObjectId,
            ref : "user"
        }
    ]
})


module.exports = model("post",PostModel);