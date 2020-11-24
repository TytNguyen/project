const googleStorage = require('@google-cloud/storage');
const Rest = require('../utils/Restware')
const {format} = require('util');
const moment = require('moment');


const storage = googleStorage({
  projectId: 'project-9e319',
  keyFilename: 'D:/nodejs/project/app/config/serviceAccountKey.json'
});

const bucket = storage.bucket("gs://project-9e319.appspot.com");
var ALPHABETICAL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (file, name, callback) => {
    try {
          let day = moment(Date.now()).format( 'YYYY-MM-DD-hh:mm:ss');
          let newFileName = `${name}/${day}_${ Array(10).join().split(',').map(function() { return ALPHABETICAL.charAt(Math.floor(Math.random() * ALPHABETICAL.length)); }).join('') }`;
    
          let fileUpload = bucket.file(newFileName);

          const blobStream = fileUpload.createWriteStream({
            public: true,
            metadata: {
              contentType: file.mimetype,
            }
          });

          blobStream.on('error', (error) => {
            return callback(1, error, 422, null, null);
          });

          console.log(bucket.name)

          blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            return callback(null, null, 200, null, url);
          });
          blobStream.end(file.buffer);
    } catch(error) {
        return callback(1, error, 422, null, null);
    }
}

module.exports = {uploadImageToStorage}
