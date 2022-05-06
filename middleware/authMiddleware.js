const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticated = async (req,res,next) => {
    try{
        const {authorization} = req.headers;

        if(authorization){
            const authToken = authorization.split(" ")[1];
            return await jwt.verify(authToken,process.env.SM_PRIVATE_KEY,function(err,decoded){
                if(err){
                    switch(err.name){
                        case "TokenExpiredError":
                            return res.status(401).json({
                                ok : true,
                                message : "Token Expired"
                            });
                        case "JsonWebTokenError":
                            return res.status(401).json({
                                ok : false,
                                message : "wrong token format"
                            })
                        default:
                            return res.status(401).json({
                                ok : false,
                                message : "Internal Error"
                            })
                    }
                }

                req.uid = decoded;
                return next();
            })
        }
        return res.status(403).json({
            ok : false,
            message : "Token not Found"
        })

    }catch(e){
        console.log(e);
        return res.status(501).json({
            ok : false,
            message : "Internal Error"
        })
    }
}
