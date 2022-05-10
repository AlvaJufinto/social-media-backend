const CommentModel = require("../model/Comment.model");
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