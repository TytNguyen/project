const Rest = require('../utils/Restware');
const MatchingManager = require('../manager/MatchingManager');

module.exports = {
    downloadFile: function (req, res) {
        const fileName = req.params.name;
        const directoryPath = global.CLOUD_API.rootPath + '/public/avatar/';
      
        res.download(directoryPath + fileName, fileName, (err) => {
          if (err) {
            res.status(500).send({
              message: "Could not download the file. " + err,
            });
          }
        });
      },

    autoMatching: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let id = parseInt(req.query.id);
        let sub_id = parseInt(req.query.sub_id);

        MatchingManager.autoMatching(accessUserId, accessUserType, id, sub_id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
        })
    },

    recommendation: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let id = parseInt(req.query.id);
        let sub_id = parseInt(req.query.sub_id);

        MatchingManager.recommend(accessUserId, accessUserType, id, sub_id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
        })
    },

    getOne: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let id = req.params.id || '';
        let query = req.query

        switch(id) 
        {
            case 'getrequest': {
                MatchingManager.getRequest(accessUserId, accessUserType, query, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                    if (errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    return Rest.sendSuccessOne(res, result, httpCode);
                });
                break;
            }
            case 'statistic': {
                MatchingManager.getStatistic(accessUserId, accessUserType, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                    if (errorCode) {
                        return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }
                    return Rest.sendSuccessOne(res, result, httpCode);
                });
                break;
            }
            default: {
                MatchingManager.getOne(accessUserId, accessUserType, id, function (errorCode, errorMessage, httpCode, errorDescription, result) {
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

        MatchingManager.getAll(accessUserId, accessUserType, query, function(errorCode, errorMessage, httpCode, errorDescription, results) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
                return Rest.sendSuccessOne(res, results, httpCode);
            }
        });
    },

    create: function(req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';

        let data = req.body;

        MatchingManager.create(accessUserId, accessUserType, data, function(errorCode, errorMessage, httpCode, errorDescription, matching) {
            if(errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = matching.id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        })
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';
        let contract = req.files || '';
        let id = req.params.id || '';

        if( id === 'deletes' ){
            let ids = req.body.ids || '';
            MatchingManager.deletes(accessUserId, accessUserType, ids, function (errorCode, errorMessage, httpCode, errorDescription) {
                if (errorCode) {
                    return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                return Rest.sendSuccessOne(res, null, httpCode);
            });
        } else {
            let data = req.body || '';
            MatchingManager.update( accessUserId, accessUserType, id, data, contract, function (errorCode, errorMessage, httpCode, errorDescription, result) {
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
}
