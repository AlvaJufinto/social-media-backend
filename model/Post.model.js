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
            type : [String, "must be a string"],
        },
        imageID : {
            type : [String, "must be a string"],
        }
    },
    description : {
        type : [String, "must be a string"],
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