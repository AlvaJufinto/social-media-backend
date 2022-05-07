const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const authRouter = require("./router/authRouter");
const userRouter = require("./router/userRouter");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}))


app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);

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


