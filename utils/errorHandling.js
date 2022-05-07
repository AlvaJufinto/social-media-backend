exports.errorHandler = (errorMessage) => {
    console.log(errorMessage);

    switch(errorMessage?.name){
        case "ValidationError":
            return {
                code : 403,
                errorData : {
                    ok : false,
                    name : errorMessage.name,
                    message : errorMessage?.message || "validation error"
                }
            }
        default:
            return {
                code : 501,
                errorData : {
                    ok : false,
                    message : "Internal Error"
                }
            }
    }
}