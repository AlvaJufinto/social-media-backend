const bcrypt = require("bcrypt");
const UserModel = require("../model/User.model");
const DetailModel = require("../model/Detail.model");
const {errorHandler} = require("../utils/utils");

exports.authSignup = async (req,res) => {
    try{
        const {
            username,fullname,email,password
        } = req.body;
        const {public_id,secure_url} = req.file || {};

        const createUser = UserModel({
            username : username,
            password : await bcrypt.hash(password,11),
            fullname : fullname,
            email : email,
            profilePict : {
                imageUrl : secure_url,
                imageID : public_id
            },
            post : [],
            followings : [],
            followers : []
        })

        const createUserDetail = DetailModel({
            belongsto : createUser._id
        })

        createUser.detail = createUserDetail._id;

        await createUser.save();
        await createUserDetail.save();

        const smtoken = await createUser.createAccessToken();
        if(!smtoken){
            return res.status(501).json({
                ok : false,
                error : "TokenError",
                message : "Cant generate any token"
            })
        }
        return res.status(201).json({
            ok : true,
            message : "successfully signed up",
            smtoken : smtoken
        })
    }catch(e){
        const errorState = errorHandler(e);
        return res.status(errorState.code).json(errorState.errorData);
    }
}


exports.authLogin = async (req,res) => {
    try{
        const {username,password} = req.body
        const user = await UserModel.findOne({username : username});

        if(user){
            isPasswordSame = await bcrypt.compare(password,user.password);
            const smtoken = await user.createAccessToken();

            if(isPasswordSame){
                return res.status(200).json({
                    ok : true,
                    smtoken : smtoken
                })
            }else{
                if(!smtoken){
                    return res.status(501).json({
                        ok : false,
                        error : "TokenError",
                        message : "Cant generate any token"
                    })
                }

                return res.status(403).json({
                    ok : false,
                    message : "wrong password"
                })
            }
        }
        return res.status(403).json({
            ok : false,
            message : "username not found"
        })
    }catch(e){
        console.log(e);
        return res.status(501).json({
            ok : false,
            message : "Internal Error"
        })
    }
}