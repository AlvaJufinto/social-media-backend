const {errorHandler} = require("../utils/utils");
const {upload} = require("../utils/multerConfig");
const cloudinary = require("../utils/cloudinaryConfig");

exports.uploadHandler = (req,res,next) => {
    return upload(req,res,function(err){
        if(err){
            const errorState = errorHandler(err);
            return res.status(errorState.code).json(errorState.errorData)
        }
        return next();
    })
}

exports.deleteHandler = (req,res,next) => {
    try{
        const {image} = req.requestedPost;
        if(image){
            cloudinary.uploader.destroy(image.imageID,function(err,result){
                if(err){
                    const errorState = errorHandler(err);
                    return res.status(errorState.code).json(errorState.errorData)
                }
                return next();
            })
        }
        return next();
    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData)
    }
}