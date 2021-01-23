const Rest = require('../utils/Restware');
const LabResultManager = require('../manager/LabResultManager');

module.exports = {
    uploadFile: function(req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';
        let id = req.params.id || '';
        let form = req.files;
        LabResultManager.uploadFile(accessUserId, accessUserType, id, form, function(errorCode, errorMessage, httpCode, errorDescription, labresult) {
            if(errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        })
    },

    create: function(req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';

        let data = req.body || '';
        let image = req.files;

        LabResultManager.create(accessUserId, accessUserType, data, image, function(errorCode, errorMessage, httpCode, errorDescription, labresult) {
            if(errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = labresult.id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        })
    },

    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let id = req.params.id || '';

        switch(id) 
        {
            case 'getrelate': {
                LabResultManager.getRelate(accessUserId, accessUserType, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                    if (errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    return Rest.sendSuccessOne(res, result, httpCode);
                });
                break;
            }
            case 'statistic': {
                LabResultManager.getStatistic(accessUserId, accessUserType, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                    if (errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    return Rest.sendSuccessOne(res, result, httpCode);
                })
                break;
            }
            default: {
                LabResultManager.getOne(accessUserId, accessUserType, id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                    if (errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    return Rest.sendSuccessOne(res, result, httpCode);
                })
                break;
            }
        }
    },

    getAll: function(req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let query = req.query || '';

        LabResultManager.getAll(accessUserId, accessUserType, query, function(errorCode, errorMessage, httpCode, errorDescription, results) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
                return Rest.sendSuccessOne(res, results, httpCode);
            }
        });
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';

        let id = req.params.id || '';
        
        if( id === 'deletes' ){
            let ids = req.body.ids || '';
            LabResultManager.deletes(accessUserId, accessUserType, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else if ( id === 'updateimage' ){
            let image = req.files;
            let resultId = req.body.resultId || '';
            let delete_ids = req.body.delete_ids || '';
            
            LabResultManager.updateImage(accessUserId, accessUserType, resultId, image, delete_ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let resData = {};
                resData.id = resultId;
                return Rest.sendSuccessOne(res, resData, httpCode);
            });
        }
        else {
            let data = req.body || '';
            LabResultManager.update( accessUserId, accessUserType, id, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                } else {
                let resData = {};
                resData.id = id;
                return Rest.sendSuccessOne(res, resData, httpCode);
            }
            });
        }
    },

    delete: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';
        let id = req.params.id || '';

        LabResultManager.delete( accessUserId, accessUserType, id, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
            let resData = {};
            resData.id = id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        }
        });
    },
}