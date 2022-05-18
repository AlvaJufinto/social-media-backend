const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const DetailSchema = Schema({
    belongsto : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    from : {
        type : String,
        default : ""
    },
    work : {
        type : String,
        default : ""
    },
    relationship : {
        type : String,
        default : ""
    },
    website : {
        type : String,
        default : ""
    }
})

module.exports = model("detail",DetailSchema);