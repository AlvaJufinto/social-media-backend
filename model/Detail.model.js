const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const DetailSchema = Schema({
    belongsto : {
        type : mongoose.Types.ObjectId,
        ref : "User"
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