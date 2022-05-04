const mongoose = require("mongoose");
const {Schema,model} = mongoose

const CommentSchema = Schema({
    postID : {
        type : mongoose.Types.ObjectId,
        ref : "post"
    },
    belongsTo : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    },
    comment : {
        type : String,
        maxLength : 255
    }
})

module.exports = model("Comment",CommentSchema);