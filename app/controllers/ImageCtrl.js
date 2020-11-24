const Rest = require('../utils/Restware');
const ImageManager = require('../manager/ImageManager');

//use libraries such as multer and salted md5 to upload files.
// const saltedMd5 =   require('salted-md5')
// const path = require('path');
// const multer = require('multer')
// const upload = multer({storage: multer.memoryStorage()})
// require('dotenv').config()

module.exports = {
  create: function(req, res) {
    let accessUserId = req.body.accessUserId;
    let accessUserType = req.body.accessUserType || '';
    
    let data = req.files || '';

    ImageManager.create(accessUserId, accessUserType, data, function(errorCode, errorMessage, httpCode, errorDescription, image) {
        if(errorCode) {
            return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let resData = "";
        resData = "id: " + image;
        return Rest.sendSuccessOne(res, resData, httpCode);
        })
    },

    calculate: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let id = req.params.id || '';

        ImageManager.calculate(accessUserId, accessUserType, id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
        })
    },

    // upload: function(req, res) {
    //     const name = saltedMd5(req.file.originalname, 'SUPER-S@LT!')
    //     const fileName = name + path.extname(req.file.originalname)
    //     await app.locals.bucket.file(fileName).createWriteStream().end(req.file.buffer)
    //     res.send('done');
    // }
}