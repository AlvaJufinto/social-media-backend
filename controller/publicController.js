const res = require("express/lib/response");
const CommentModel = require("../model/Comment.model");
const DetailModel = require("../model/Detail.model");
const PostModel = require("../model/Post.model");
const UserModel = require("../model/User.model");
const {errorHandler,publicUserParser,publicPostParser} = require("../utils/utils");

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
        return res.status(401).json({
            ok : false,
            message : "data not found",
            data : []
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
                    detail : userDetail,
                    posts : userPosts,
                    followers : userFollowers.map((v)=>{
                        return publicUserParser(v)
                    }),
                    followings : userFollowings.map((v)=>{
                        return publicUserParser(v)
                    }),
                }
            })
        }
        return res.status(401).json({
            ok : true,
            message : "data not found"
        });
    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}