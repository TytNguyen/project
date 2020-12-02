const cloudinary = require('cloudinary').v2;
const Rest = require('../utils/Restware');
const fs = require('fs');

cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
})

module.exports = {
    deleteImage: async (file, callback) => {
        for (var image of file) {
            await cloudinary.uploader.destroy(image).then(result => {
                console.log(result)
            })
        }
        callback('ok')
    },

    uploadMultiple: async (files, folder, callback) => {
        let list = [];
        let image = [];
        files.forEach((value) => {
            image.push(value.path)
        })

        for (var file of image) {
            await cloudinary.uploader.upload(file, { folder: folder }).then(result => {
                fs.unlinkSync(file);
                console.log(result.public_id)
                list.push([result.secure_url, result.public_id]);
            })
        }
        callback(list)
    },

    reSizeImage: (id, h, w) => {
        return cloudinary.url(id, {
            height: h,
            width: w,
            crop: 'scale',
            format: 'jpg'
        })
    }
}