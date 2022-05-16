const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const DetailSchema = Schema({
    belongsto : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    from : {
        type : [String, "must be a string"]
    },
    work : {
        type : [String, "must be a string"]
    },
    relationship : {
        type : [String, "must be a string"]
    },
    website : {
        type : [String, "must be a string"]
    }
})

module.exports = model("detail",DetailSchema);