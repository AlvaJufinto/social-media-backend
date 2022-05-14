const {errorHandler} = require("../utils/utils")
const {upload} = require("../utils/multerConfig")

exports.uploadHandler = (req,res,next) => {
    return upload(req,res,function(err){
        if(err){
            const errorState = errorHandler(err);
            return res.status(errorState.code).json(errorState.errorData)
        }
        return next();
    })
}