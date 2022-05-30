exports.errorHandler = (errorMessage) => {
    const errMess = (code=501,name="Internal Error",message="internal error occured") => {
        return {
            code : code,
            errorData : {
                ok : false,
                name : name,
                message : message
            }
        }
    }
    console.log(errorMessage);

    switch(errorMessage?.name){
        case "ValidationError":
            const validatorKeys = Object.keys(errorMessage.errors) || []
            let message = `${errorMessage?._message || "validation error"} in ${validatorKeys.join(",")}`

            return errMess(403,errorMessage.name, message);
        case "MongoServerError":
            switch(errorMessage.code){
                case 11000:
                    let keyValue = Object.keys(errorMessage.keyValue);
                    let message = `there ${keyValue.length > 1 ? "are" : "is"} duplicate in ${keyValue.join(",")}`

                    return errMess(403,errorMessage.name,message);
                default:

                    return errMess();
            }
        case "CastError":

            return errMess(403,errorMessage.name,"request not valid")

        case "UNF":
            return errMess(403,errorMessage.name,"user not found")

        case "DNF":
            return errMess(403,errorMessage.name,"Data not found")

        case "Error":
            switch(errorMessage.message){
                case "OIA":
                    return errMess(403,errorMessage.message, "Only Images are allowed");

                case "FTL":
                    return errMess(403,errorMessage.message,"File too Large")

                default:
                    return errMess();

            }
        default:
            return errMess();

    }
}

exports.publicUserParser = (userDetail) => {
    const {profilePict,username,fullname} = userDetail
    return {
        profilePict,
        username,
        fullname,
    }
}

exports.publicPostParser = (postDetail) => {
    const {image,description,comments,likes,_id,date} = postDetail;
    return {
        postId : _id,
        image,description,
        comments: comments.length,
        likes : likes.length,
        date
    }
}

exports.detailParser = (detail) => {
    const {from,work,relationship,website} = detail
    return {
        from,work,relationship,website
    }
}

exports.userToSet = (userList) => {
    let userSet = {};

    userList.map((val)=>{
        userSet[val._id] = this.publicUserParser(val)
    })
    return userSet;
}