const DetailModel = require("../model/Detail.model");
const PostModel = require("../model/Post.model");
const UserModel = require("../model/User.model");
const {errorHandler} = require("../utils/errorHandling");

exports.me = async (req,res) => {
    try{
        const {uid} = req.uid;
        const userData = await UserModel.findById(uid);
        const userDetail = await DetailModel.findById(userData.detail)
        return res.status(200).json({
            ok : true,
            message : "data fetched",
            data : {
                _id : userData._id,
                username : userData.username,
                fullname : userData.fullname,
                email : userData.email,
                detail : userDetail,
                followers : userData.followers,
                followings : userData.followings,
            }
        })
    }catch(e){
        console.log(e);
        return res.status(501).json({
            ok : false,
            message : "internal error"
        })
    }
}

exports.addPost = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {description} = req.body;
        const {public_id,secure_url} = req.file || {};
        const createPost = PostModel({
            belongsto : uid,
            image : {
                imageUrl : secure_url,
                imageID : public_id
            },
            description : description,
            comments : [],
            likes : []

        })
        await createPost.save();
        await UserModel.updateOne({_id : uid},{
            $push : {post : [createPost._id]}
        });

        return res.status(200).json({
            ok : true,
            message : "Data Added",
            data : createPost
        })

    }catch(e){
        const error = errorHandler(e);
        return res.status(error.code).json(error.errorData);
    }
}


exports.deletepost = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {_id} = req.requestedPost;
        const deletePost = await PostModel.deleteOne({_id : _id});
        if(deletePost.deletedCount != 0){
            await UserModel.updateOne({_id : uid},{
                $pull : {post : _id}
            })
            return res.status(200).json({
                ok : true,
                message : "data deleted"
            })
        }
        return res.status(200).json({
            ok : false,
            name : "failed",
            message: "Failed to delete data"
        })
    }catch(e){
        const error = errorHandler(e);
        return res.status(error.code).json(error.errorData);
    }
}