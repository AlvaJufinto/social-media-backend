const mongoose = require("mongoose");
const {Schema,model} = mongoose

const PostModel = Schema({
    belongsto : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : "User"
    },
    image : {
        imageUrl : {
            type : String,
            required : true,
            default : "defaultimage.jpg"
        },
        imageID : {
            type : String,
            required : "defaultimage.jpg"
        }
    },
    description : {
        type : String,
        maxLength : 250
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