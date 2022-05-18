const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();

const authRouter = require("./router/authRouter");
const userRouter = require("./router/userRouter");
const interactRouter = require("./router/interactRouter");
const publicRouter = require("./router/publicRouter");
    
const app = express();

app.use(cors({
    origin : "*",
    credentials : true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}))

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interact", interactRouter);
app.use("/api/public", publicRouter);

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


