const DetailModel = require("../model/Detail.model");
const PostModel = require("../model/Post.model");
const UserModel = require("../model/User.model");

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