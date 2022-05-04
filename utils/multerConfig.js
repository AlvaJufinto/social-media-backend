const multer = require("multer");
const path = require("path");

const CloudninaryStorageEngine = require("./customStorage");

const upload = multer({
    storage : CloudninaryStorageEngine({}),
    fileFilter : function(req,file,cb){
        const extension = path.extname(file.originalname).toLowerCase();
        if(extension == ".png" || extension == ".jpg" || extension == ".jpeg"){
            const randomize = Math.floor(Math.random()  * Date.now() );
            file.originalname = `${randomize}-${file.originalname}`;
            return cb(null, true);
        }
        return cb(new Error("only images are allowed"));
    },
}).single("gambar");


module.exports ={
    upload
}