const CommentModel = require("../model/Comment.model");
const DetailModel = require("../model/Detail.model");
const PostModel = require("../model/Post.model");
const UserModel = require("../model/User.model");
const cloudinary = require("../utils/cloudinaryConfig");
const {errorHandler,publicUserParser,detailParser,userToSet, publicPostParser} = require("../utils/utils");

// BEGIN USER-RELATED-ROUTE
exports.me = async (req,res) => {
    try{
        const {uid} = req.uid;
        const userData = await UserModel.findById(uid);
        const userDetail = await DetailModel.findById(userData.detail);
        const userFollowings = await UserModel.find({_id : {$in : userData.followings.slice(0,5)}});
        const userFollowers = await UserModel.find({_id : {$in : userData.followers.slice(0,5)}});
        const userPosts = await PostModel.find({_id : {$in : userData.post}})

        return res.status(200).json({
            ok : true,
            message : "data fetched",
            data : {
                _id : userData._id,
                username : userData.username,
                fullname : userData.fullname,
                description: userData.description,
                email : userData.email,
                detail : detailParser(userDetail),
                posts : userPosts.map((val)=>{
                    return {
                        belongsto : publicUserParser(userData),
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
    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}
exports.editDetail = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {description, from, work, relationship, website} = req.body;
        const {deletePict} = req.query;
        const {public_id,secure_url} = req.file || {};

        const user = await DetailModel.findOne({belongsto : uid});
        const {imageID,imageUrl} = user.backgroundPict || {};

        if(user){
            if(deletePict === "1" && !public_id && !secure_url){
                if(imageID && imageUrl){
                    await cloudinary.uploader.destroy(imageID);
                }
                user.backgroundPict = undefined;
            }
            if(public_id && secure_url){
                if(imageID && imageUrl){
                    await cloudinary.uploader.destroy(imageID);
                }
                user.backgroundPict = {
                    imageUrl : secure_url,
                    imageID : public_id
                }
            }

            // hard coded till i found a better implementation LMAO
            user.from = from ? from : user.from;
            user.description = description ? description : user.description;
            user.work = work ? work : user.work;
            user.relationship = relationship ? relationship : user.relationship;
            user.website = website ? website : user.website;

            await user.save();
            return res.status(200).json({
                ok : true,
                message : "detail updated",
                data : {
                    description : user.description,
                    from : user.from,
                    work : user.work,
                    relationship : user.relationship,
                    website : user.website,
                    backgroundPict : user.backgroundPict
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

exports.editProfile = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {fullname,email,description} = req.body;
        const {deletePict} = req.query;
        const {public_id,secure_url} = req.file || {};

        const user = await UserModel.findById(uid);
        const {imageID,imageUrl} = user.profilePict || {};

        if(user){
            if(deletePict === "1" && !public_id && !secure_url){
                if(imageID && imageUrl){
                    await cloudinary.uploader.destroy(imageID);
                }
                user.profilePict = undefined;
            }
            if(public_id && secure_url){
                if(imageID && imageUrl){
                    await cloudinary.uploader.destroy(imageID);
                }
                user.profilePict = {
                    imageUrl : secure_url,
                    imageID : public_id
                }
            }

            user.fullname = fullname ? fullname : user.fullname;
            user.email = email ? email : user.email;
            user.description = description ? description : user.description;
            await user.save();

            return res.status(200).json({
                ok : true,
                message : "data changed",
                data : {
                    fullname : user.fullname,
                    email : user.email,
                    description : user.description,
                    profilePict : user.profilePict
                }
            })
        }

    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}

exports.feeds = async (req,res) => {
    try{
        const {uid} = req.uid;
        const user = await UserModel.findById(uid);
        if(user){
            const userFollowingList = user.followings;
            const postBelongsTo = userToSet(await UserModel.find({_id : {$in : userFollowingList}}));
            const userFeed = await PostModel.find({belongsto : {$in : userFollowingList}})

            return res.status(200).json({
                ok : true,
                message : "data fetched",
                data : userFeed.map((val)=>{
                    return {
                        belongsto : postBelongsTo[val.belongsto.toString()],
                        post : publicPostParser(val)
                    }
                })
            });
        }
        throw({
            name : "UNF"
        })

    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}
// END USER-RELATED-ROUTE



// BEGIN POST-RELATED-ROUTE
exports.addPost = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {description} = req.body;
        const {public_id,secure_url} = req.file || {};
        const createPost = PostModel({
            date : Date.now(),
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
            data : {
                belongsto : publicUserParser(await UserModel.findById(uid)),
                post : createPost
            }
        })

    }catch(e){
        const error = errorHandler(e);
        return res.status(error.code).json(error.errorData);
    }
}


exports.deletepost = async (req,res) => {
    try{
        const {uid} = req.uid;
        const {_id,comments} = req.requestedPost;
        await CommentModel.deleteMany({_id : {$in : comments}});
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
// END POST-RELATED-ROUTE