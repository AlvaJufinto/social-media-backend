const mongoose = require("mongoose");
const {Schema,model} = mongoose

const PostModel = model({
    image : {
        type  : String
    },
    description : {
        type : String,
        maxLength : 250
    },
    comments : [
        {
            type : mongoose.Types.ObjectId,
            ref : "user"
        }
    ],
    likes : [
        {
            type : mongoose.Types.ObjectId,
            ref : "user"
        }
    ]
})
