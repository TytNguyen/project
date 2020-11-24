const JsonWebToken = require('jsonwebtoken');

const Rest = require('../utils/Restware');
const StakeholderManager = require('../manager/StakeholderManager');

module.exports = {
    create: function(req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';

        let data = req.body || '';

        StakeholderManager.create(accessUserId, accessUserType, data, function(errorCode, errorMessage, httpCode, errorDescription, company) {
            if(errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = company.id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        })
    },

    getOne: function(req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let id = req.params.id || '';

        switch(id) 
        {
            case 'statistic': {
                StakeholderManager.getStatistic(accessUserId, accessUserType, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                    if(errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    return Rest.sendSuccessOne(res, result, httpCode);
                });
                break;
            }
            case 'type': {
                let data = req.body;
                StakeholderManager.getTypeOfStakeHolder(accessUserId, accessUserType, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                    if(errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    return Rest.sendSuccessOne(res, result, httpCode);
                });
                break;
            }
            default: {
                StakeholderManager.getOne(accessUserId, accessUserType, id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                    if (errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    return Rest.sendSuccessOne(res, result, httpCode);
                });
                break;
            }
        }
    },

    getAll: function(req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let query = req.query || '';

        StakeholderManager.getAll(accessUserId, accessUserType, query, function(errorCode, errorMessage, httpCode, errorDescription, results) {
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
            StakeholderManager.deletes(accessUserId, accessUserType, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else {
            let data = req.body || '';

            StakeholderManager.update( accessUserId, accessUserType, id, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
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

        StakeholderManager.delete( accessUserId, accessUserType, id, function (errorCode, errorMessage, httpCode, errorDescription) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
            let resData = {};
            resData.id = id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        }
        });
    }
};