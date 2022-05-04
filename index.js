const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended : true
}))


mongoose.connect(process.env.MONGODB)
    .then((val)=>{
        console.log("DB Connected");
        app.listen(process.env.PORT || 5000, () => {
            console.log("server started")
        })
    })
    .catch((err)=>{
        console.log(err);
        console.log("an error occurred");
    });



