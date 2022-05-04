var concat = require('concat-stream')
const cloudinary = require("./cloudinaryConfig");
const DatauriParser = require("datauri/parser");
const path = require("path");

function CustomMemoryStorage (opts) {}

CustomMemoryStorage.prototype._handleFile = function _handleFile (req, file, cb) {

    file.stream.pipe(concat(async function (buffer) {       
        let parser = new DatauriParser();
        
        let uriFile = parser.format(path.extname(file.originalname).toString(),buffer);
        return await cloudinary.uploader.upload(uriFile.content, function(error,result){
            return cb(null, {
                public_id : result.public_id,
                secure_url : result.secure_url
            })
        })

    }))
}

CustomMemoryStorage.prototype._removeFile = function _removeFile (req, file, cb) {

    delete file.buffer
    cb(null)
}

module.exports = function (opts) {
  return new CustomMemoryStorage(opts)
}