var multer = require('multer');
var crypto = require("crypto");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const match = ["image/png", "image/jpeg"]

        if (match.indexOf(file.mimetype === -1)) {
            cb(null, global.CLOUD_API.rootPath + '/public/avatar/');
        } else cb(null, global.CLOUD_API.rootPath + '/public/avatar/'); //hỉnh ảnh sẽ chưa trong folder uploads
       
    },
    filename: (req, file, cb) => {
        var fileName = crypto.randomBytes(10).toString('hex');

        const match = ["image/png", "image/jpeg"]

        if (match.indexOf(file.mimetype === -1)) {
            cb(null , `${fileName}.pdf`);
        } else cb(null , file.originalname); 

        // mặc định sẽ save name của hình ảnh
        // là name gốc, chúng ta có thể rename nó.  
    }
})

var upload = multer({storage:storage}); //save trên local của server khi dùng multer

module.exports = upload;