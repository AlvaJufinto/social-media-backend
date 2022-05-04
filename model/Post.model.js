const mongoose = require("mongoose");
const {Schema,model} = mongoose

const PostModel = Schema({
    image : {
        imageUrl : {
            type : String,
            required : true
        },
        imageID : {
            type : String,
            required : true
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