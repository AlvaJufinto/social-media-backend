const mongoose = require("mongoose");
const {Schema,model} = mongoose

const CommentModel = Schema({
    postID : {
        type : mongoose.Types.ObjectId,
        ref : "post",
        required : [true,"Field needs to be filled"]
    },
    belongsto : {
        type : mongoose.Types.ObjectId,
        ref : "user",
        required : [true,"Field needs to be filled"]
    },
    comment : {
        type : String,
        maxLength : [255,"Maximum length is only 255"],
        required : [true,"Field needs to be filled"]
    }
})

module.exports = model("Comment",CommentModel);