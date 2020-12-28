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

const sendGrid = require('../config/SendMail');

module.exports = {
    createByAdmin: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';
        let Data = req.body || '';
        let file = req.files;
        
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
        UserManager.create(data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if ( errorCode ) {
                return Rest.sendError( res, errorCode, errorMessage, httpCode, errorDescription );
            } else {
                JsonWebToken.sign({ id: result.id, userName: result.email, type: result.type, displayName: result.displayName, phone: result.phone, avatar: result.avatar}, Config.jwtAuthKey, { expiresIn: '25 days' }, function(error, token) {
                    if( error )
                    {
                        return Rest.sendError( res, 4000, 'create_token_fail', 400, error );
                    }else{
                        sendGrid.sendMailToVerifyAccount(result.email, token, function (errorCode, errorMessage, httpCode, errorDescription, message) {
                            if( errorCode )
                            {
                                return Rest.sendError( res, 400, 'send_mail_fail', 400, error );
                            }else{
                                return Rest.sendSuccessOne(res, message, httpCode);
                            }
                        });
                    }
                    
                });
            }
            
        });
    },

    verifyAccount: function (req, res) {
        let token = req.params.token || '';
        sendGrid.verifyToken(token, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if( errorCode )
            {
                return Rest.sendError( res, null, token, 400, errorCode );
            }
            UserManager.updateUserAfterRegister(result, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, result, httpCode);
            })
                
        })
    },

    forgotPassword: function (req, res) {
        let email = req.body.email || '';
        JsonWebToken.sign({userName: email}, Config.jwtAuthKey, { expiresIn: '25 days' }, function(error, token) {
            sendGrid.forgotPassword(email, token, function (errorCode, errorMessage, httpCode, errorDescription, message) {
                if( errorCode )
                {
                    return Rest.sendError( res, 4000, 'create_token_fail', 400, error );
                }else{
                    return Rest.sendSuccessOne(res, message, httpCode);
                }
            });
        });
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
        let file = req.files;

        let id = req.params.id || '';

        if( id === 'deletes' ){
            let ids = req.body.ids || '';
            UserManager.deletes(accessUserId, accessUserType, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else if (id === 'updatepassword') {
            let data = req.body || '';
            UserManager.updatePassword( accessUserId, accessUserType, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                } else {
                let resData = {};
                resData.id = result;
                return Rest.sendSuccessOne(res, resData, httpCode);
            }
            });
        }
        else {
            let data = req.body || '';

            UserManager.update( accessUserId, accessUserType, id, data, file, function (errorCode, errorMessage, httpCode, errorDescription, result) {
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
        let userName = req.body.userName || '';
        let password = req.body.password || '';

        UserManager.authenticate(userName, password, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if ( errorCode ) {
                return Rest.sendError( res, errorCode, errorMessage, httpCode, errorDescription );
            }
            JsonWebToken.sign({ id: result.id, userName: result.email, type: result.type, displayName: result.displayName, phone: result.phone, avatar: result.avatar}, Config.jwtAuthKey, { expiresIn: '25 days' }, function(error, token) {
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
