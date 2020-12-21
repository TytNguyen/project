var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, global.CLOUD_API.rootPath + '/public/avatar/'); //hỉnh ảnh sẽ chưa trong folder uploads
       
    },
    filename: (req, file, cb) => {
        cb(null , file.originalname); ;// mặc định sẽ save name của hình ảnh
        // là name gốc, chúng ta có thể rename nó.  
    }
})

var upload = multer({storage:storage}); //save trên local của server khi dùng multer

module.exports = upload;