const Rest = require('../utils/Restware');
const AttendanceManager = require('../manager/AttendanceManager');

module.exports = {
    getMeetingStakeholderAttend: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let id = req.params.id || '';
        let query = req.query || '';

        AttendanceManager.getMeetingStakeholderAttend(accessUserId, accessUserType, id, query, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
        })
        
    },

    getStakeholderAttendMeeting: function (req, res) {
        let accessUserId = req.query.accessUserId || '';
        let accessUserType = req.query.accessUserType || '';

        let id = req.params.id || '';
        let query = req.query || '';

        AttendanceManager.getStakeholderAttendMeeting(accessUserId, accessUserType, id, query, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            return Rest.sendSuccessOne(res, result, httpCode);
        })
        
    },

    updates: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';

        let data = req.body.ids || '';
        let id = req.params.id || '';

        AttendanceManager.updates( accessUserId, accessUserType, id, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
            let resData = {};
            resData.id = result;
            return Rest.sendSuccessOne(res, resData, httpCode);
        }
        });
    },

    update: function (req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';

        let data = req.body || '';

        AttendanceManager.update( accessUserId, accessUserType, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
            if (errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            } else {
            let resData = {};
            resData.id = result;
            return Rest.sendSuccessOne(res, resData, httpCode);
        }
        });
    },

    create: function(req, res) {
        let accessUserId = req.body.accessUserId || '';
        let accessUserType = req.body.accessUserType || '';

        let data = req.body || '';

        AttendanceManager.create(accessUserId, accessUserType, data, function(errorCode, errorMessage, httpCode, errorDescription, meeting) {
            if(errorCode) {
                return Rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
            }
            let resData = {};
            resData.id = meeting.id;
            return Rest.sendSuccessOne(res, resData, httpCode);
        })
    },
}