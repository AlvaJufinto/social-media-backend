const PostModel = require("../model/Post.model");
const {errorHandler} = require("../utils/errorHandling");

exports.likePost = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {postId} = req.params;
        const requestedPost = await PostModel.findById(postId);
        if(requestedPost){
            if(requestedPost.likes.indexOf(uid) === -1){
                requestedPost.likes.push(uid);
                await requestedPost.save();
                return res.status(200).json({
                    ok : true,
                    message : "liked"
                })
            }
            return res.status(403).json({
                ok : false,
                message : "Already liked"
            })
        }
        return res.status(401).json({
            ok : false,
            message : "data not found"
        })

    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}

exports.unlikePost = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {postId} = req.params;
        const requestedPost = await PostModel.findById(postId);
        if(requestedPost){
            if(requestedPost.likes.indexOf(uid) >= 0){
                requestedPost.likes = requestedPost.likes.filter(item => item != uid);
                await requestedPost.save();
                return res.status(200).json({
                    ok : true,
                    message : "unliked"
                })
            }
            return res.status(403).json({
                ok : false,
                message : "post is not liked"
            })
        }
        return res.status(401).json({
            ok : false,
            message : "data not found"
        })

    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}