const mongoose = require("mongoose");
const {Schema,model} = mongoose

const CommentModel = Schema({
    postID : {
        type : mongoose.Types.ObjectId,
        ref : "post",
        required : true
    },
    belongsto : {
        type : mongoose.Types.ObjectId,
        ref : "user",
        required : true
    },
    comment : {
        type : String,
        maxLength : 255,
        required : true
    }
})

module.exports = model("Comment",CommentModel);