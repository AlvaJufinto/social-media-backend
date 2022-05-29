const multer = require("multer");
const path = require("path");

const CloudninaryStorageEngine = require("./customStorage");

const upload = multer({
    storage : CloudninaryStorageEngine({}),
    fileFilter : function(req,file,cb){
        try{
            const extension = path.extname(file.originalname).toLowerCase();
            if(extension == ".png" || extension == ".jpg" || extension == ".jpeg"){
                const randomize = Math.floor(Math.random()  * Date.now() );
                file.originalname = `${randomize}-${file.originalname}`;

                return cb(null, true);
            }
            return cb(new Error("OIA"))
        }catch(e){
            return cb(new Error("Internal Error"))
        }
    },
}).single("gambar");


module.exports ={
    upload
}