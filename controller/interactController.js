const CommentModel = require("../model/Comment.model");
const PostModel = require("../model/Post.model");
const UserModel = require("../model/User.model");
const {errorHandler} = require("../utils/utils");

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
        throw({
            name : "DNF"
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
        throw({
            name : "DNF"
        })

    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}

exports.followUser = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {userId} = req.params;

        if(uid != userId){
            const requestedUser = await UserModel.findById(userId);

            if(requestedUser){
                const currentUser = await UserModel.findById(uid);

                if(requestedUser.followers.indexOf(uid) === -1){
                    requestedUser.followers.push(uid);
                    currentUser.followings.push(userId);

                    await requestedUser.save();
                    await currentUser.save();

                    return res.status(200).json({
                        ok : true,
                        message : "followed"
                    })
                }
                return res.status(403).json({
                    ok : true,
                    message : "already followed"
                })
            }
            throw({
                name : "DNF"
            })
        }
        return res.status(403).json({
            ok : true,
            message : "cant follow yourself"
        })
    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}

exports.unfollowUser = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {userId} = req.params;

        if(uid != userId){
            const requestedUser = await UserModel.findById(userId);

            if(requestedUser){
                const currentUser = await UserModel.findById(uid);

                if(requestedUser.followers.indexOf(uid) >= 0){
                    requestedUser.followers = requestedUser.followers.filter(item => item != uid);
                    currentUser.followings = requestedUser.followings.filter(item => item != userId);

                    await requestedUser.save();
                    await currentUser.save();

                    return res.status(200).json({
                        ok : true,
                        message : "unfollowed"
                    })
                }
                return res.status(403).json({
                    ok : true,
                    message : "already unfollowed"
                })
            }
            throw({
                name : "DNF"
            })
        }
        return res.status(403).json({
            ok : true,
            message : "cant unfollow yourself"
        })
    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}


exports.comment = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {postId} = req.params;
        const {comment} = req.body;
        const requestedPost = await PostModel.findById(postId);
        if(requestedPost){
            const createComment = CommentModel({
                postID : requestedPost._id,
                belongsto : uid,
                comment : comment
            })

            requestedPost.comments.push(createComment._id);
            await createComment.save();
            await requestedPost.save();

            return res.status(200).json({
                ok : true,
                message : "comment added",
                data : createComment
            })
        }
        throw({
            name : "DNF"
        })
    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}