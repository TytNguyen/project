const cloudinary = require('cloudinary').v2;
const Rest = require('../utils/Restware');
const fs = require('fs');

cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_NAME}`,
    api_key : `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
})

module.exports = {
    uploadSingle: (file, folder, callback) => {
        setTimeout(() => {
            cloudinary.uploader.upload(file, {folder: folder}).then(result => {
                fs.unlinkSync(file);
                callback(result.secure_url)
            })
        })
    },

    uploadMultiple: (file, folder, callback) => {
        cloudinary.uploader.upload(file, {folder: folder}).then(result => {
            fs.unlinkSync(file);
            return callback(null, null, 200, null, {url: result.secure_url,
                                                    id: result.public_id,
                                                    thumb1: self.reSizeImage(result.public_id, 200, 200),
                                                    main: self.reSizeImage(result.public_id, 500, 500),
                                                    thumb2: self.reSizeImage(result.public_id, 300, 300)});
        })
    },

    reSizeImage: (id, h, w) => {
        return cloudinary.url(id, {
            height:h,
            width: w,
            crop: 'scale',
            format: 'jpg'
        })
    }
}