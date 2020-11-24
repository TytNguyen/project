/**
 * Created by bioz on 1/13/2017.
 */
// third party components
const JsonWebToken = require('jsonwebtoken');

// our components
const Config = require('../config/Global');
const UserManager = require('../manager/UserManager.js');
const Rest = require('../utils/Restware');
const uploadImage = require('../middlewares/UploadToFirebase')

const cloudinary = require('../middlewares/Cloudinary')


module.exports = {
    // test: function(req, res) {
    //     let imageDetails = {}


    //     let data = req.body;
    //     let file = req.file;
    //     UserManager.test(data, file, function (errorCode, errorMessage, httpCode, errorDescription, result) {
    //         if (errorCode) {
    //             return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
    //         }
    //         return Rest.sendSuccessOne(res, result, httpCode);
    //     })
    // },

    uploadMultipleFiles: function(req, res) {
        //req.files chính là khi upload multiple images
        let res_promises = req.files.map(file => {
            cloudinary.uploadMultiple(file.path, 'user', function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, result, httpCode);
            })
        })
        
        // Promise.all get imgas
        Promise.all(res_promises)
        .then(async (arrImg) => {
           //arrImg chính là array mà chúng ta đã upload 
           // các bạn có thể sử dụng arrImg để save vào database, hay hơn thì sử dụng mongodb
           res.json(req.files)
        })
        .catch((error) => {
            console.error('> Error>', error);
        })
    },

    uploadImageToFirebase: function (req, res) {
        let file = req.file;

        uploadImage.uploadImageToStorage(file, 'user', function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
    })
    },

    createByAdmin: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';
        let file = req.file;

        let Data = req.body || '';

        UserManager.createByAdmin(accessUserId, accessUserType, Data, file, function (errorCode, errorMessage, httpCode, errorDescription, user) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
                let resData = {};
                resData.id = user.id;
                return Rest.sendSuccessOne(res, resData, httpCode);
            }
        })
    },

    create: function (req, res) {
        let data = req.body || '';
        let file = req.file;
        console.log(req.body)
        UserManager.create(data, file, function (errorCode, errorMessage, httpCode, errorDescription, user) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
                let resData = {};
                resData.id = user.id;
                return Rest.sendSuccessOne(res, resData, httpCode);
            }
        })
    },

    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let id = req.params.id || '';

        if(id === 'statistic'){
            UserManager.getStatistic(accessUserId, accessUserType, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, result, httpCode);
            })
        }else{
            UserManager.getOne(accessUserId, accessUserType, id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, result, httpCode);
            })
        }
    },

    getAll: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';
        let query = req.query || '';

        UserManager.getAll(accessUserId, accessUserType, query, function (errorCode, errorMessage, httpCode, errorDescription, results) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessMany(res, results, httpCode);
        });
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';
        let image = req.file;

        let id = req.params.id || '';

        if( id === 'deletes' ){
            let ids = req.body.ids || '';
            UserManager.deletes(accessUserId, accessUserType, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        }else {
            let data = req.body || '';

            UserManager.update( accessUserId, accessUserType, id, data, image, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                } else {
                let resData = {};
                resData.id = result;
                return Rest.sendSuccessOne(res, resData, httpCode);
            }
            });
        }
    },



    // deletes: function (req, res) 
    //     let accessUserId = req.body.accessUserId || '';
    //     let accessUserType = req.body.accessUserType || '';

    //     let ids = req.body.ids || '';
    //         UserManager.deletes(accessUserId, accessUserType, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
    //             if (errorCode) {
    //                 return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
    //             }
    //             return Rest.sendSuccessOne(res, null, httpCode);
    //         });
    // },

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';
        let id = req.params.id || '';

        UserManager.delete( accessUserId, accessUserType, id, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
            let resData = {};
            resData.id = id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        }
        });
    },

    login: function (req, res) {
        let loginName = req.body.loginName || '';
        let password = req.body.password || '';

        UserManager.authenticate(loginName, password, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if ( errorCode ) {
                return Rest.sendError( res, errorCode, errorMessage, httpCode, errorDescription );
            }
            JsonWebToken.sign({ id: result.id, loginName: result.email, type: result.type, displayName: result.displayName, phone: result.phone }, Config.jwtAuthKey, { expiresIn: '25 days' }, function(error, token) {
                if( error )
                {
                    return Rest.sendError( res, 4000, 'create_token_fail', 400, error );
                }else{
                    return Rest.sendSuccessToken(res, token, result);
                }
            });
        });
    }
};
