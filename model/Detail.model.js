const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const DetailSchema = Schema({
    belongsto : {
        type : mongoose.Types.ObjectId,
    },
    profilePict : {
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
    BackgroundPict : {
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
    from : {
        type : String
    },
    work : {
        type : String
    },
    relationship : {
        type : String
    },
    website : {
        type : String
    }
})

module.exports = model("detail",DetailSchema);