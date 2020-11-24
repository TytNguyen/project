const Rest = require('../utils/Restware');
const ProcessesManager = require('../manager/ProcessesManager');

module.exports = {
    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';

        let id = req.params.id || '';

        let data = req.body || '';

        ProcessesManager.update( accessUserId, accessUserType, id, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
            let resData = {};
            resData.id = result;
            return Rest.sendSuccessOne(res, resData, httpCode);
            }
        });
    },
}