const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Processes = require('../models/Processes');
const moment = require('moment');

module.exports = {
    // create: function (accessUserId, accessUserType, data, callback) {
    //     try {
    //         if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
    //             return callback(4, 'invalid_user_right', 403, 'you must be admin to do this process', null);
    //         }

    //         let queryObj = {};
    //         queryObj.createdBy = accessUserId;
    //         queryObj.updatedBy = accessUserId;
    //         queryObj.createdAt = moment(Date.now()).add(7, "hour");
    //         queryObj.updatedAt = moment(Date.now()).add(7, "hour");

    //         queryObj.mid = data.mid;
    //         queryObj.step = data.step;

    //         Processes.create(queryObj).then(processes => {
    //             "use strict";
    //             return callback(null, null, 200, null, processes);
    //         }).catch(function(error) {
    //             "use strict";
    //             return callback(4, 'create_processes_fail', 400, error, null);
    //         });
    //         }catch(error) {
    //             return callback(4, 'create_processes_fail', 400, error, null);
    //     }
    // },

    update: function (accessUserId, accessUserType, matchingId, updateData, callback) {
        try {
            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(1, 'invalid_user_type', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            if (!(Pieces.VariableBaseTypeChecking(matchingId, 'string')
                && Validator.isInt(matchingId))
                && !Pieces.VariableBaseTypeChecking(matchingId, 'number')) {
                return callback(4, 'invalid_matching_id', 400, 'matching id is incorrect', null);
            }

            if (updateData.step !== undefined) {
                queryObj.step = updateData.step;
            }

            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");

            where.mid = matchingId;

            Processes.update(
                queryObj,
                { where: where }).then(result => {
                    "use strict";
                    if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                        return callback(null, null, 200, null, matchingId);
                    } else {
                        return callback(4, 'update_processes_fail', 400, '', null);
                    }
                }).catch(function (error) {
                    "use strict";
                    return callback(4, 'update_processes_fail', 420, error, null);
                });
        } catch (error) {
            return callback(4, 'update_processes_fail', 400, error, null);
        }
    },
}