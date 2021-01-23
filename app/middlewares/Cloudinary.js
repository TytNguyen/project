const cloudinary = require('cloudinary').v2;
const Rest = require('../utils/Restware');
const fs = require('fs');
const Pieces = require('../utils/Pieces');

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

    deleteForResult: async (file, delete_ids, location, callback) => {
        if (file != undefined || file.length > 0) {
            delete_ids.forEach (function(del, index) {
                file.forEach (function(image, ind) {
                    if (del == image) {
                        file.splice(ind, 1);
                    }
                })

                location.forEach (function(log, indx) {
                    if (log.indexOf(del) !== -1) {
                        location.splice(indx, 1);
                    }
                })
            })
        }

        for (var image of delete_ids) {
            await cloudinary.uploader.destroy(image).then(result => {
                console.log(result)
            })
        }

        callback([file, location])
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