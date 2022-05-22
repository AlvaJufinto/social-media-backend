const res = require("express/lib/response");
const CommentModel = require("../model/Comment.model");
const DetailModel = require("../model/Detail.model");
const PostModel = require("../model/Post.model");
const UserModel = require("../model/User.model");
const {errorHandler,publicUserParser,publicPostParser,detailParser} = require("../utils/utils");

exports.getPost = async (req,res) => {
    try{
        const {postId} = req.params;
        const requestedPost = await PostModel.findById(postId);

        if(requestedPost){
            const userWhoPosted = await UserModel.findById(requestedPost.belongsto);
            const {comments} = requestedPost;
            let commentDetail = comments;

            if(comments){
                const allComment = await CommentModel.find({_id : {$in : comments}});
                commentDetail = await Promise.all(allComment.map(async(cVal) => {
                    const commentBelongsTo = await UserModel.findById(cVal.belongsto);
                    return {
                        comment : cVal.comment,
                        belongsto : publicUserParser(commentBelongsTo)
                    }
                }))
            }

            return res.status(200).json({
                ok : true,
                message : "post found",
                data : {
                    post : publicPostParser(requestedPost),
                    belongsto : publicUserParser(userWhoPosted),
                    comments : commentDetail
                }
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

exports.getPostLikes = async (req,res) => {
    try{
        const {postId} = req.params;
        const requestedPost = await PostModel.findById(postId);
        if(requestedPost){
            const {likes} = requestedPost;
            const userFromLikes = await UserModel.find({_id : {$in : likes}});
            return res.status(200).json({
                ok : true,
                message : "data fetched",
                data : userFromLikes.map((v)=>{
                    return publicUserParser(v);
                })
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

exports.getUser = async (req,res) => {
    try{
        const {username} = req.params;
        const user = await UserModel.findOne({username : username});

        if(user){
            const userDetail = await DetailModel.findById(user.detail);
            const userPosts = await PostModel.find({_id : {$in : user.post}})
            const userFollowings = await UserModel.find({_id : {$in : user.followings.slice(0,5)}});
            const userFollowers = await UserModel.find({_id : {$in : user.followers.slice(0,5)}})

            return res.status(200).json({
                ok : true,
                message : "data fetched",
                data : {
                    _id : user._id,
                    username : user.username,
                    fullname : user.fullname,
                    email : user.email,
                    detail : detailParser(userDetail),
                    posts : userPosts.map((val)=>{
                        return {
                            belongsto : publicUserParser(user),
                            post : val
                        }
                    }),
                    followers : userFollowers.map((v)=>{
                        return publicUserParser(v)
                    }),
                    followings : userFollowings.map((v)=>{
                        return publicUserParser(v)
                    }),
                }
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

exports.perks = async (req,res) => {
    try{
        const {rPerks,username} = req.params;
        const user = await UserModel.findOne({username : username});

        if(user){
            switch(rPerks){
                case "followers":
                    const userFollowers = await UserModel.find({_id : {$in : user.followers}});
                    return res.status(200).json({
                        ok : true,
                        data : userFollowers.map((v)=>{
                            return publicUserParser(v)
                        })
                    })
                case "followings":
                    const userFollowings = await UserModel.find({_id : {$in : user.followings}});
                    return res.status(200).json({
                        ok : true,
                        data : userFollowings.map((v)=>{
                            return publicUserParser(v)
                        })
                    })
                default :
                    return res.status(403).json({
                        ok : false,
                        message : "only followings and followers"
                    })
            }
        }

        throw({
            name : "UNF"
        })

    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}